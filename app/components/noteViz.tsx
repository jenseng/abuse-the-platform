import type { ReactElement } from "react";
import { useRef } from "react";
import { usePeriodicRerender } from "~/hooks/usePeriodicRerender";
import type { Data } from "~/routes/__serverNotes/multiplayer";
import { truncateSession } from "~/routes/__serverNotes/multiplayer";
import { noteIndices } from "./piano";

export function NoteViz({
  initialData,
  currentData,
  windowSize,
}: {
  initialData: Data[];
  currentData?: Data;
  windowSize: number;
}) {
  // transform the svg group horizontally over 10 seconds so that it
  // slides smoothly to the left
  const animationDuration = 10_000; // see keyframes in app.css
  // when we optimally would have started the current animation
  const animationStartTs = useRef(
    Math.floor(Date.now() / animationDuration) * animationDuration
  );
  // when we actually started animating
  const animationRealStartTs = useRef(Date.now());
  const now = Date.now();
  if (now >= animationStartTs.current + windowSize) {
    // start a new animation
    animationStartTs.current =
      Math.floor(now / animationDuration) * animationDuration;
    animationRealStartTs.current = now;
  }
  const windowIdealStart = animationStartTs.current - windowSize;
  const windowStart = animationRealStartTs.current - windowSize;

  usePeriodicRerender(100);
  const session = useRef([...initialData]);
  if (
    currentData &&
    session.current[session.current.length - 1]?.timestamp !==
      currentData.timestamp
  ) {
    session.current.push(currentData);
    truncateSession(session.current);
  }

  const lines: ReactElement[] = [];
  const minNote = 24;
  const maxNote = 63;
  for (
    let tickTs = windowIdealStart;
    tickTs < animationStartTs.current + windowSize + 5_000;
    tickTs += 1000
  ) {
    lines.push(
      <line
        key={tickTs}
        x1={tickTs - windowStart}
        x2={tickTs - windowStart}
        y1={minNote}
        y2={maxNote}
        strokeWidth={8}
        stroke="#000"
      ></line>
    );
  }
  for (const { notes, timestamp } of session.current) {
    for (const note of notes) {
      lines.push(
        <line
          key={`${note}${timestamp}`}
          x1={timestamp - windowStart}
          x2={timestamp - windowStart + 100}
          y1={noteIndices[note]}
          y2={noteIndices[note]}
          strokeWidth={1}
          stroke="#7ac"
        />
      );
    }
  }

  return (
    <>
      <svg
        className="timeline"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 ${minNote} ${windowSize} ${maxNote}`}
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 160 }}
      >
        <g key={animationStartTs.current}>{lines}</g>
      </svg>
    </>
  );
}
