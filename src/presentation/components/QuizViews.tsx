import {
  Badge,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import React from "react";
import {
  formatPitchLabel,
  getClefConfiguration,
  type Clef,
  type Pitch,
} from "../../domain/music/pitch";
import {
  type AnsweredState,
  type QuestionState,
  type SummaryState,
} from "../../application/quiz/quizState";
import { PianoKeyboard } from "./PianoKeyboard";
import { StaffNotation } from "./StaffNotation";
import styles from "./QuizViews.module.css";

interface ClefSelectionProps {
  readonly onSelect: (clef: Clef) => void;
}

interface ClefChoice {
  readonly clef: Clef;
  readonly description: string;
  readonly range: string;
}

const CLEF_CHOICES: ReadonlyArray<ClefChoice> = [
  {
    clef: "treble",
    description: "高音域でよく使う音部記号",
    range: "ド4〜ラ5",
  },
  {
    clef: "bass",
    description: "低音域でよく使う音部記号",
    range: "ミ2〜ド4",
  },
  {
    clef: "alto",
    description: "中央のドが第3線にある音部記号",
    range: "レ3〜シ4",
  },
];

interface ClefChoiceCardProps {
  readonly choice: ClefChoice;
  readonly onSelect: (clef: Clef) => void;
}

const ClefChoiceCard: React.FC<ClefChoiceCardProps> = ({
  choice,
  onSelect,
}) => {
  const configuration = getClefConfiguration(choice.clef);
  const handleClick = React.useCallback((): void => {
    onSelect(choice.clef);
  }, [choice.clef, onSelect]);

  return (
    <Card className={styles.clefCard} size="3">
      <Flex direction="column" gap="4" height="100%">
        <div className={styles.clefCardCopy}>
          <Heading as="h2" size="6">
            {configuration.label}
          </Heading>
          <Text color="gray" size="3">
            {choice.description}
          </Text>
        </div>
        <Badge color="teal" size="2" variant="soft">
          出題範囲 {choice.range}
        </Badge>
        <Button onClick={handleClick} size="3">
          {configuration.label}で始める
        </Button>
      </Flex>
    </Card>
  );
};

export const ClefSelection: React.FC<ClefSelectionProps> = ({ onSelect }) => (
  <main className={styles.selection}>
    <div className={styles.heroCopy}>
      <Badge color="teal" size="2" variant="soft">
        NOTE READING PRACTICE
      </Badge>
      <Heading as="h1" size="9">
        譜読み練習
      </Heading>
      <Text color="gray" size="4">
        練習する音部記号を選んでください。表示された音を鍵盤から探します。
      </Text>
    </div>
    <div className={styles.clefGrid}>
      {CLEF_CHOICES.map((choice) => (
        <ClefChoiceCard choice={choice} key={choice.clef} onSelect={onSelect} />
      ))}
    </div>
  </main>
);

interface PracticeScreenProps {
  readonly state: QuestionState | AnsweredState;
  readonly onAnswer: (pitch: Pitch) => void;
  readonly onFinish: () => void;
  readonly onNext: () => void;
}

const Feedback: React.FC<{
  readonly state: QuestionState | AnsweredState;
}> = ({ state }) => {
  if (state.phase === "question") {
    return (
      <div aria-live="polite" className={styles.prompt}>
        <Text color="gray" size="3">
          鍵盤から同じ高さの白鍵を選んでください。
        </Text>
      </div>
    );
  }

  return (
    <Callout.Root
      aria-live="polite"
      className={styles.feedback}
      color={state.isCorrect === true ? "green" : "red"}
      role="status"
      size="2"
      variant="soft"
    >
      <Callout.Text>
        {state.isCorrect === true
          ? `正解！ ${formatPitchLabel(state.currentPitch)}`
          : `不正解。正解は ${formatPitchLabel(state.currentPitch)} です。`}
      </Callout.Text>
    </Callout.Root>
  );
};

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  state,
  onAnswer,
  onFinish,
  onNext,
}) => {
  const configuration = getClefConfiguration(state.clef);

  return (
    <main className={styles.practice}>
      <header className={styles.practiceHeader}>
        <div>
          <Text color="gray" size="2" weight="medium">
            練習中
          </Text>
          <Heading as="h1" size="7">
            {configuration.label}
          </Heading>
        </div>
        <Flex align="center" gap="4">
          <div aria-label="現在の成績" className={styles.score}>
            <Text color="gray" size="2">
              正解
            </Text>
            <Text size="5" weight="bold">
              {state.correctCount} / {state.answerCount}
            </Text>
          </div>
          <Button color="gray" onClick={onFinish} size="2" variant="soft">
            練習を終了
          </Button>
        </Flex>
      </header>

      <Card className={styles.practiceCard} size="4">
        <div className={styles.questionArea}>
          <Text color="gray" size="2" weight="medium">
            この音はどの鍵盤？
          </Text>
          <StaffNotation clef={state.clef} pitch={state.currentPitch} />
          <Feedback state={state} />
        </div>
        <PianoKeyboard onAnswer={onAnswer} state={state} />
        <div className={styles.nextAction}>
          {state.phase === "answered" ? (
            <Button onClick={onNext} size="3">
              次の問題
            </Button>
          ) : (
            <Text color="gray" size="2">
              回答すると正解が表示されます
            </Text>
          )}
        </div>
      </Card>
    </main>
  );
};

interface SessionSummaryProps {
  readonly state: SummaryState;
  readonly onRestart: () => void;
  readonly onSelectClef: () => void;
}

const AccuracyCopy: React.FC<{ readonly state: SummaryState }> = ({
  state,
}) => {
  if (state.accuracy.kind === "unanswered") {
    return (
      <Text color="gray" size="4">
        まだ回答していません
      </Text>
    );
  }

  return (
    <Text className={styles.accuracy} size="9" weight="bold">
      {state.accuracy.value}%
    </Text>
  );
};

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  state,
  onRestart,
  onSelectClef,
}) => (
  <main className={styles.summary}>
    <Card className={styles.summaryCard} size="4">
      <Flex align="center" direction="column" gap="5">
        <Badge color="teal" size="2" variant="soft">
          {getClefConfiguration(state.clef).label}
        </Badge>
        <div className={styles.summaryHeading}>
          <Text color="gray" size="2" weight="medium">
            今回の正答率
          </Text>
          <AccuracyCopy state={state} />
        </div>
        <div className={styles.summaryStats}>
          <div aria-label={`正解数 ${state.correctCount}`}>
            <Text color="gray" size="2">
              正解数
            </Text>
            <Text size="6" weight="bold">
              {state.correctCount}
            </Text>
          </div>
          <div aria-label={`回答数 ${state.answerCount}`}>
            <Text color="gray" size="2">
              回答数
            </Text>
            <Text size="6" weight="bold">
              {state.answerCount}
            </Text>
          </div>
        </div>
        <Flex gap="3" justify="center" wrap="wrap">
          <Button onClick={onRestart} size="3">
            同じ音部記号でもう一度
          </Button>
          <Button color="gray" onClick={onSelectClef} size="3" variant="soft">
            音部記号を選び直す
          </Button>
        </Flex>
      </Flex>
    </Card>
  </main>
);
