import { useLocation } from "@remix-run/react";

// easter egg to pre-record a special song
export function Rickord() {
  const location = useLocation();
  if (location.pathname !== "/progressive") return null;
  return (
    <button
      className="rickord"
      type="button"
      onClick={rickord}
      title="Pre-record"
    >
      🧻
    </button>
  );
}

function rickord() {
  const song = [
    ["c4"],
    ["d4"],
    ["f4"],
    ["d4"],
    ["a#2", "d4", "f4", "a4"],
    ["a#2", "d4", "f4", "a4"],
    ["c3", "c4", "e4", "g4"],
    ["c4"],
    ["d4"],
    ["f4"],
    ["d4"],
    ["a2", "c4", "e4", "g4"],
    ["a2", "c4", "e4", "g4"],
    ["d3", "a3", "d4", "f4"],
    ["e4"],
    ["d4"],
    ["c4"],
    ["d4"],
    ["f4"],
    ["d4"],
    ["g2", "a#3", "d4", "f4"],
    ["g4"],
    ["c3", "c4", "e4"],
    ["d4"],
    ["c4"],
    ["c4"],
    ["a2", "e3", "a3", "c4", "g4"],
    ["d3", "a3", "d4", "f4"],
    [],
  ];
  for (const notes of song) {
    history.pushState(
      "",
      "",
      `?buster=${Math.random()}&${new URLSearchParams(
        notes.map((n) => ["playNote", n])
      )}`
    );
  }
  history.go(-song.length);
}
