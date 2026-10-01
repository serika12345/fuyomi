import {
  BarlineType,
  Formatter,
  Renderer,
  Stave,
  StaveNote,
} from "vexflow/bravura";
import {
  clefToVexFlowName,
  pitchToVexFlowKey,
  type Clef,
  type Pitch,
} from "../../domain/music/pitch";

const STAFF_WIDTH = 440;
const STAFF_HEIGHT = 180;

export const renderStaffNotation = (
  container: HTMLDivElement,
  clef: Clef,
  pitch: Pitch,
): (() => void) => {
  container.replaceChildren();

  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(STAFF_WIDTH, STAFF_HEIGHT);

  const context = renderer.getContext();
  const vexFlowClef = clefToVexFlowName(clef);
  const stave = new Stave(16, 42, STAFF_WIDTH - 32)
    .setBegBarType(BarlineType.NONE)
    .setEndBarType(BarlineType.NONE)
    .addClef(vexFlowClef);
  const note = new StaveNote({
    keys: [pitchToVexFlowKey(pitch)],
    duration: "w",
    clef: vexFlowClef,
    alignCenter: true,
    strokePx: 6,
  });

  stave.setContext(context).draw();
  note.setStave(stave).setContext(context);
  Formatter.SimpleFormat([note], STAFF_WIDTH / 2);
  note.draw();

  const svg = container.querySelector("svg");

  if (svg instanceof SVGSVGElement) {
    svg.setAttribute("viewBox", `0 0 ${STAFF_WIDTH} ${STAFF_HEIGHT}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("aria-hidden", "true");
  }

  return () => {
    container.replaceChildren();
  };
};
