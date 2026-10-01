import { describe, expect, it } from "vitest";
import { getClefConfiguration, pitchToId } from "../music/pitch";
import { createQuestionDeck } from "./questionDeck";

const pickFirst = (): number => 0;

describe("question deck", () => {
  it("contains every pitch in the clef range exactly once", () => {
    const source = getClefConfiguration("treble").questionPitches;
    const deck = createQuestionDeck(source, { kind: "none" }, pickFirst);

    expect(deck.map(pitchToId)).toEqual(source.map(pitchToId));
  });

  it("does not repeat the preceding pitch at a deck boundary", () => {
    const source = getClefConfiguration("treble").questionPitches;
    const precedingPitch =
      source[0] ?? getClefConfiguration("bass").markerPitch;
    const deck = createQuestionDeck(
      source,
      { kind: "some", value: precedingPitch },
      pickFirst,
    );

    expect(deck).toHaveLength(13);
    expect(pitchToId(deck[0] ?? precedingPitch)).not.toBe(
      pitchToId(precedingPitch),
    );
    expect(deck.filter((pitch) => pitchToId(pitch) === "C4")).toHaveLength(1);
  });
});
