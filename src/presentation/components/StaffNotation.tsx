import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import React from "react";
import {
  getClefConfiguration,
  type Clef,
  type Pitch,
} from "../../domain/music/pitch";
import { renderStaffNotation } from "../../infrastructure/music/renderStaffNotation";
import styles from "./StaffNotation.module.css";

interface StaffNotationProps {
  readonly clef: Clef;
  readonly pitch: Pitch;
}

const emptyCleanup = (): void => {
  return;
};

export const StaffNotation: React.FC<StaffNotationProps> = ({
  clef,
  pitch,
}) => {
  const containerRef = React.useRef<O.Option<HTMLDivElement>>(O.none);
  const handleContainerRef = React.useCallback<
    React.RefCallback<HTMLDivElement>
  >((element) => {
    containerRef.current = O.fromNullable(element);
  }, []);

  React.useEffect(
    () =>
      pipe(
        containerRef.current,
        O.match(
          () => emptyCleanup,
          (container) => renderStaffNotation(container, clef, pitch),
        ),
      ),
    [clef, pitch],
  );

  return (
    <div
      aria-label={`${getClefConfiguration(clef).label}の問題の音符`}
      className={styles.root}
      data-testid="staff-notation"
      ref={handleContainerRef}
      role="img"
    />
  );
};
