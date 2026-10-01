import { describe, expect, it } from "vitest";
import {
  createPitch,
  formatPitchLabel,
  getClefConfiguration,
  pitchToId,
  type Clef,
} from "./pitch";

describe("pitch", () => {
  const rangeCases: ReadonlyArray<
    readonly [Clef, string, string, string, string, string]
  > = [
    ["treble", "C4", "A5", "C4", "C6", "C5"],
    ["bass", "E2", "C4", "C2", "C4", "C3"],
    ["alto", "D3", "B4", "C3", "C5", "C4"],
  ];

  it.each(rangeCases)(
    "defines the expected question and keyboard ranges for %s",
    (
      clef,
      expectedQuestionFirst,
      expectedQuestionLast,
      expectedKeyboardFirst,
      expectedKeyboardLast,
      expectedMarker,
    ) => {
      const configuration = getClefConfiguration(clef);
      const questionIds = configuration.questionPitches.map(pitchToId);
      const keyboardIds = configuration.keyboardPitches.map(pitchToId);

      expect(questionIds).toHaveLength(13);
      expect(questionIds[0]).toBe(expectedQuestionFirst);
      expect(questionIds[12]).toBe(expectedQuestionLast);
      expect(keyboardIds).toHaveLength(15);
      expect(keyboardIds[0]).toBe(expectedKeyboardFirst);
      expect(keyboardIds[14]).toBe(expectedKeyboardLast);
      expect(pitchToId(configuration.markerPitch)).toBe(expectedMarker);
    },
  );

  it("formats fixed-do and international pitch names together", () => {
    expect(formatPitchLabel(createPitch("C", 4))).toBe("ド4 (C4)");
    expect(formatPitchLabel(createPitch("B", 3))).toBe("シ3 (B3)");
  });
});
