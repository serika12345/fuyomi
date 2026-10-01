import { describe, expect, it } from "vitest";
import { createPitch, pitchToId } from "../../domain/music/pitch";
import {
  advanceQuestion,
  answerQuestion,
  finishSession,
  restartSession,
  startSession,
} from "./quizState";

const pickFirst = (): number => 0;

describe("quiz state", () => {
  it("starts with the selected clef and its first question", () => {
    const state = startSession("treble", pickFirst);

    expect(state.phase).toBe("question");
    expect(state.clef).toBe("treble");
    expect(pitchToId(state.currentPitch)).toBe("C4");
    expect(state.correctCount).toBe(0);
    expect(state.answerCount).toBe(0);
  });

  it("locks the first answer and counts it once", () => {
    const initial = startSession("treble", pickFirst);
    const answered = answerQuestion(initial, createPitch("C", 4));
    const ignoredSecondAnswer = answerQuestion(answered, createPitch("D", 4));

    expect(answered.phase).toBe("answered");
    if (answered.phase !== "answered") {
      return;
    }
    expect(answered.correctCount).toBe(1);
    expect(answered.answerCount).toBe(1);
    expect(ignoredSecondAnswer).toBe(answered);
  });

  it("records an incorrect answer and advances only when requested", () => {
    const initial = startSession("treble", pickFirst);
    const answered = answerQuestion(initial, createPitch("D", 4));

    expect(answered.phase).toBe("answered");
    if (answered.phase !== "answered") {
      return;
    }
    expect(answered.correctCount).toBe(0);
    expect(answered.answerCount).toBe(1);
    expect(pitchToId(answered.currentPitch)).toBe("C4");

    const next = advanceQuestion(answered, pickFirst);

    expect(next.phase).toBe("question");
    if (next.phase !== "question") {
      return;
    }
    expect(pitchToId(next.currentPitch)).toBe("D4");
  });

  it("summarizes unanswered and answered sessions", () => {
    const unanswered = finishSession(startSession("bass", pickFirst));

    expect(unanswered.phase).toBe("summary");
    if (unanswered.phase !== "summary") {
      return;
    }
    expect(unanswered.answerCount).toBe(0);
    expect(unanswered.accuracy.kind).toBe("unanswered");

    const answered = finishSession(
      answerQuestion(startSession("alto", pickFirst), createPitch("D", 3)),
    );

    expect(answered.phase).toBe("summary");
    if (answered.phase !== "summary") {
      return;
    }
    expect(answered.correctCount).toBe(1);
    expect(answered.answerCount).toBe(1);
    expect(answered.accuracy).toEqual({ kind: "percentage", value: 100 });
  });

  it("restarts a completed session with reset totals", () => {
    const summary = finishSession(
      answerQuestion(startSession("alto", pickFirst), createPitch("D", 3)),
    );
    const restarted = restartSession(summary, pickFirst);

    expect(restarted.phase).toBe("question");
    if (restarted.phase !== "question") {
      return;
    }
    expect(restarted.clef).toBe("alto");
    expect(restarted.correctCount).toBe(0);
    expect(restarted.answerCount).toBe(0);
  });
});
