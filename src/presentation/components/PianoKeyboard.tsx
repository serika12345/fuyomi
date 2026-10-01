import React from "react";
import {
  formatPitchLabel,
  getClefConfiguration,
  pitchesEqual,
  pitchToId,
  type Pitch,
} from "../../domain/music/pitch";
import {
  type AnsweredState,
  type QuestionState,
} from "../../application/quiz/quizState";
import styles from "./PianoKeyboard.module.css";

interface PianoKeyboardProps {
  readonly state: QuestionState | AnsweredState;
  readonly onAnswer: (pitch: Pitch) => void;
}

type KeyAnswerState = "idle" | "correct" | "incorrect";

const BLACK_KEY_POSITIONS: ReadonlyArray<number> = [
  1, 2, 4, 5, 6, 8, 9, 11, 12, 13,
];

const getKeyAnswerState = (
  state: QuestionState | AnsweredState,
  pitch: Pitch,
): KeyAnswerState => {
  if (state.phase === "question") {
    return "idle";
  }

  if (pitchesEqual(pitch, state.currentPitch)) {
    return "correct";
  }

  return pitchesEqual(pitch, state.selectedPitch) ? "incorrect" : "idle";
};

interface WhiteKeyProps {
  readonly answerState: KeyAnswerState;
  readonly disabled: boolean;
  readonly isMarker: boolean;
  readonly onAnswer: (pitch: Pitch) => void;
  readonly pitch: Pitch;
}

const WhiteKey: React.FC<WhiteKeyProps> = ({
  answerState,
  disabled,
  isMarker,
  onAnswer,
  pitch,
}) => {
  const handleClick = React.useCallback((): void => {
    onAnswer(pitch);
  }, [onAnswer, pitch]);

  return (
    <button
      aria-label={formatPitchLabel(pitch)}
      className={styles.whiteKey}
      data-answer-state={answerState}
      data-pitch={pitchToId(pitch)}
      disabled={disabled}
      onClick={handleClick}
      type="button"
    >
      <span aria-hidden="true" className={styles.marker}>
        {isMarker === true ? "ド" : ""}
      </span>
    </button>
  );
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  state,
  onAnswer,
}) => {
  const configuration = getClefConfiguration(state.clef);
  const disabled = state.phase === "answered";

  return (
    <div aria-label="回答用鍵盤" className={styles.scrollArea}>
      <div className={styles.keyboard}>
        <div className={styles.whiteKeys}>
          {configuration.keyboardPitches.map((pitch) => (
            <WhiteKey
              answerState={getKeyAnswerState(state, pitch)}
              disabled={disabled}
              isMarker={pitchesEqual(pitch, configuration.markerPitch)}
              key={pitchToId(pitch)}
              onAnswer={onAnswer}
              pitch={pitch}
            />
          ))}
        </div>
        <div aria-hidden="true" className={styles.blackKeys}>
          {BLACK_KEY_POSITIONS.map((position) => (
            <span
              className={styles.blackKey}
              data-position={position}
              key={position}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
