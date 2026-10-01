import {
  createPitch,
  getClefConfiguration,
  pitchesEqual,
  type Clef,
  type Pitch,
} from "../../domain/music/pitch";
import {
  createQuestionDeck,
  type RandomSource,
} from "../../domain/quiz/questionDeck";

interface ActiveSessionFields {
  readonly clef: Clef;
  readonly currentPitch: Pitch;
  readonly remainingPitches: ReadonlyArray<Pitch>;
  readonly correctCount: number;
  readonly answerCount: number;
}

export type SelectionState = { readonly phase: "selection" };

export type QuestionState = ActiveSessionFields & {
  readonly phase: "question";
};

export type AnsweredState = ActiveSessionFields & {
  readonly phase: "answered";
  readonly selectedPitch: Pitch;
  readonly isCorrect: boolean;
};

export type Accuracy =
  | { readonly kind: "unanswered" }
  | { readonly kind: "percentage"; readonly value: number };

export interface SummaryState {
  readonly phase: "summary";
  readonly clef: Clef;
  readonly correctCount: number;
  readonly answerCount: number;
  readonly accuracy: Accuracy;
}

export type QuizState =
  SelectionState | QuestionState | AnsweredState | SummaryState;

export const INITIAL_QUIZ_STATE: SelectionState = { phase: "selection" };

const FALLBACK_PITCH = createPitch("C", 4);

const createQuestionState = (
  clef: Clef,
  deck: ReadonlyArray<Pitch>,
  correctCount: number,
  answerCount: number,
): QuestionState => ({
  phase: "question",
  clef,
  currentPitch: deck[0] ?? FALLBACK_PITCH,
  remainingPitches: deck.slice(1),
  correctCount,
  answerCount,
});

export const startSession = (
  clef: Clef,
  random: RandomSource,
): QuestionState => {
  const configuration = getClefConfiguration(clef);
  const deck = createQuestionDeck(
    configuration.questionPitches,
    { kind: "none" },
    random,
  );

  return createQuestionState(clef, deck, 0, 0);
};

export const answerQuestion = (
  state: QuizState,
  selectedPitch: Pitch,
): QuizState => {
  if (state.phase !== "question") {
    return state;
  }

  const isCorrect = pitchesEqual(state.currentPitch, selectedPitch);

  return {
    ...state,
    phase: "answered",
    selectedPitch,
    isCorrect,
    correctCount: state.correctCount + (isCorrect === true ? 1 : 0),
    answerCount: state.answerCount + 1,
  };
};

export const advanceQuestion = (
  state: QuizState,
  random: RandomSource,
): QuizState => {
  if (state.phase !== "answered") {
    return state;
  }

  if (state.remainingPitches.length > 0) {
    return createQuestionState(
      state.clef,
      state.remainingPitches,
      state.correctCount,
      state.answerCount,
    );
  }

  const configuration = getClefConfiguration(state.clef);
  const nextDeck = createQuestionDeck(
    configuration.questionPitches,
    { kind: "some", value: state.currentPitch },
    random,
  );

  return createQuestionState(
    state.clef,
    nextDeck,
    state.correctCount,
    state.answerCount,
  );
};

const calculateAccuracy = (
  correctCount: number,
  answerCount: number,
): Accuracy =>
  answerCount === 0
    ? { kind: "unanswered" }
    : {
        kind: "percentage",
        value: Math.round((correctCount / answerCount) * 100),
      };

export const finishSession = (state: QuizState): QuizState => {
  if (state.phase !== "question" && state.phase !== "answered") {
    return state;
  }

  return {
    phase: "summary",
    clef: state.clef,
    correctCount: state.correctCount,
    answerCount: state.answerCount,
    accuracy: calculateAccuracy(state.correctCount, state.answerCount),
  };
};

export const restartSession = (
  state: QuizState,
  random: RandomSource,
): QuizState =>
  state.phase === "summary" ? startSession(state.clef, random) : state;

export const returnToSelection = (): SelectionState => INITIAL_QUIZ_STATE;
