import { createPitch, pitchesEqual, type Pitch } from "../music/pitch";

export type OptionalPitch =
  { readonly kind: "none" } | { readonly kind: "some"; readonly value: Pitch };

export type RandomSource = () => number;

const FALLBACK_PITCH = createPitch("C", 4);

const boundedRandomIndex = (length: number, random: RandomSource): number => {
  const candidate = Math.floor(random() * length);

  if (Number.isFinite(candidate) === false) {
    return 0;
  }

  return Math.max(0, Math.min(length - 1, candidate));
};

const shufflePitches = (
  pitches: ReadonlyArray<Pitch>,
  random: RandomSource,
): ReadonlyArray<Pitch> => {
  if (pitches.length === 0) {
    return [];
  }

  const selectedIndex = boundedRandomIndex(pitches.length, random);
  const selectedPitch = pitches[selectedIndex] ?? pitches[0] ?? FALLBACK_PITCH;
  const remainingPitches = pitches.filter(
    (_pitch, index) => index !== selectedIndex,
  );

  return [selectedPitch, ...shufflePitches(remainingPitches, random)];
};

const moveFirstRepeat = (
  deck: ReadonlyArray<Pitch>,
  previousPitch: Pitch,
): ReadonlyArray<Pitch> => {
  const firstPitch = deck[0] ?? FALLBACK_PITCH;

  if (pitchesEqual(firstPitch, previousPitch) === false) {
    return deck;
  }

  const alternateIndex = deck.findIndex(
    (pitch) => pitchesEqual(pitch, previousPitch) === false,
  );

  if (alternateIndex <= 0) {
    return deck;
  }

  const alternatePitch = deck[alternateIndex] ?? firstPitch;

  return [
    alternatePitch,
    ...deck.filter((_pitch, index) => index !== alternateIndex),
  ];
};

export const createQuestionDeck = (
  sourcePitches: ReadonlyArray<Pitch>,
  previousPitch: OptionalPitch,
  random: RandomSource,
): ReadonlyArray<Pitch> => {
  const shuffled = shufflePitches(sourcePitches, random);

  return previousPitch.kind === "some"
    ? moveFirstRepeat(shuffled, previousPitch.value)
    : shuffled;
};
