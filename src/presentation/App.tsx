import React from "react";
import {
  advanceQuestion,
  answerQuestion,
  finishSession,
  INITIAL_QUIZ_STATE,
  restartSession,
  returnToSelection,
  startSession,
  type QuizState,
} from "../application/quiz/quizState";
import { type Clef, type Pitch } from "../domain/music/pitch";
import {
  ClefSelection,
  PracticeScreen,
  SessionSummary,
} from "./components/QuizViews";

const browserRandom = (): number => Math.random();

const renderScreen = (
  state: QuizState,
  actions: {
    readonly onAnswer: (pitch: Pitch) => void;
    readonly onClefSelect: (clef: Clef) => void;
    readonly onFinish: () => void;
    readonly onNext: () => void;
    readonly onRestart: () => void;
    readonly onSelectClef: () => void;
  },
): React.ReactNode => {
  switch (state.phase) {
    case "selection":
      return <ClefSelection onSelect={actions.onClefSelect} />;
    case "question":
    case "answered":
      return (
        <PracticeScreen
          onAnswer={actions.onAnswer}
          onFinish={actions.onFinish}
          onNext={actions.onNext}
          state={state}
        />
      );
    case "summary":
      return (
        <SessionSummary
          onRestart={actions.onRestart}
          onSelectClef={actions.onSelectClef}
          state={state}
        />
      );
  }
};

export const App: React.FC = () => {
  const [state, setState] = React.useState<QuizState>(INITIAL_QUIZ_STATE);

  const handleClefSelect = React.useCallback((clef: Clef): void => {
    setState(startSession(clef, browserRandom));
  }, []);
  const handleAnswer = React.useCallback((pitch: Pitch): void => {
    setState((currentState) => answerQuestion(currentState, pitch));
  }, []);
  const handleNext = React.useCallback((): void => {
    setState((currentState) => advanceQuestion(currentState, browserRandom));
  }, []);
  const handleFinish = React.useCallback((): void => {
    setState((currentState) => finishSession(currentState));
  }, []);
  const handleRestart = React.useCallback((): void => {
    setState((currentState) => restartSession(currentState, browserRandom));
  }, []);
  const handleSelectClef = React.useCallback((): void => {
    setState(returnToSelection());
  }, []);

  return renderScreen(state, {
    onAnswer: handleAnswer,
    onClefSelect: handleClefSelect,
    onFinish: handleFinish,
    onNext: handleNext,
    onRestart: handleRestart,
    onSelectClef: handleSelectClef,
  });
};
