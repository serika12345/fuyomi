export type NoteLetter = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Clef = "treble" | "bass" | "alto";

export interface Pitch {
  readonly letter: NoteLetter;
  readonly octave: number;
}

export interface ClefConfiguration {
  readonly clef: Clef;
  readonly label: string;
  readonly questionPitches: ReadonlyArray<Pitch>;
  readonly keyboardPitches: ReadonlyArray<Pitch>;
  readonly markerPitch: Pitch;
}

const JAPANESE_NOTE_NAMES: Readonly<Record<NoteLetter, string>> = {
  C: "ド",
  D: "レ",
  E: "ミ",
  F: "ファ",
  G: "ソ",
  A: "ラ",
  B: "シ",
};

export const createPitch = (letter: NoteLetter, octave: number): Pitch => ({
  letter,
  octave,
});

export const pitchToId = (pitch: Pitch): string =>
  `${pitch.letter}${pitch.octave}`;

export const formatPitchLabel = (pitch: Pitch): string =>
  `${JAPANESE_NOTE_NAMES[pitch.letter]}${pitch.octave} (${pitchToId(pitch)})`;

export const pitchesEqual = (first: Pitch, second: Pitch): boolean =>
  first.letter === second.letter && first.octave === second.octave;

const nextNaturalPitch = (pitch: Pitch): Pitch => {
  switch (pitch.letter) {
    case "C":
      return createPitch("D", pitch.octave);
    case "D":
      return createPitch("E", pitch.octave);
    case "E":
      return createPitch("F", pitch.octave);
    case "F":
      return createPitch("G", pitch.octave);
    case "G":
      return createPitch("A", pitch.octave);
    case "A":
      return createPitch("B", pitch.octave);
    case "B":
      return createPitch("C", pitch.octave + 1);
  }
};

const createNaturalPitchRange = (
  firstPitch: Pitch,
  count: number,
): ReadonlyArray<Pitch> =>
  count <= 0
    ? []
    : [
        firstPitch,
        ...createNaturalPitchRange(nextNaturalPitch(firstPitch), count - 1),
      ];

export const getClefConfiguration = (clef: Clef): ClefConfiguration => {
  switch (clef) {
    case "treble":
      return {
        clef,
        label: "ト音記号",
        questionPitches: createNaturalPitchRange(createPitch("C", 4), 13),
        keyboardPitches: createNaturalPitchRange(createPitch("C", 4), 15),
        markerPitch: createPitch("C", 5),
      };
    case "bass":
      return {
        clef,
        label: "ヘ音記号",
        questionPitches: createNaturalPitchRange(createPitch("E", 2), 13),
        keyboardPitches: createNaturalPitchRange(createPitch("C", 2), 15),
        markerPitch: createPitch("C", 3),
      };
    case "alto":
      return {
        clef,
        label: "アルト記号",
        questionPitches: createNaturalPitchRange(createPitch("D", 3), 13),
        keyboardPitches: createNaturalPitchRange(createPitch("C", 3), 15),
        markerPitch: createPitch("C", 4),
      };
  }
};

export const clefToVexFlowName = (clef: Clef): string => clef;

export const pitchToVexFlowKey = (pitch: Pitch): string =>
  `${pitch.letter.toLowerCase()}/${pitch.octave}`;
