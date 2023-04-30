import { forwardRef, useEffect, useRef } from "react";

/*
 * Callouts:
 *  - buttons
 *  - autofocus (comes in handy for SSR and forwards/back navigation)
 */

export function Piano({
  onPlayNote,
  activeNotes = [],
  buster,
}: {
  onPlayNote?(note: string, el: HTMLButtonElement): void;
  activeNotes?: string[];
  buster?: string;
}) {
  const keysRef = useRef<Record<string, HTMLButtonElement>>({});

  useMappedKeyboardKeys(keysRef);

  return (
    <div className="piano">
      {allNotes
        .filter((_, i) => i >= 24 && i < 64) // just keep the middle notes, 88 is a lot
        .map(({ note, octave }) => (
          <Key
            key={`${note}${octave}${
              activeNotes.includes(`${note}${octave}`) ? buster : ""
            }`}
            note={note}
            octave={octave}
            onPlay={onPlayNote}
            active={activeNotes.includes(`${note}${octave}`)}
            ref={(el: HTMLButtonElement) =>
              (keysRef.current[`${note}${octave}`] = el)
            }
          />
        ))}
    </div>
  );
}

export const KeyboardMap = {
  a: "g3",
  w: "g#3",
  s: "a3",
  e: "a#3",
  d: "b3",
  f: "c4",
  t: "c#4",
  g: "d4",
  y: "d#4",
  h: "e4",
  j: "f4",
  i: "f#4",
  k: "g4",
  o: "g#4",
  l: "a4",
  p: "a#4",
  ";": "b4",
  "'": "c5",
} as const;
type MappedKeyboardKey = keyof typeof KeyboardMap;

// map the middle and top rows of the computer keyboard to the middle piano keys (f => middle C)
function useMappedKeyboardKeys(
  keysRef: React.MutableRefObject<Record<string, HTMLButtonElement>>
) {
  useEffect(() => {
    function keyPress(event: KeyboardEvent) {
      const key = event.key as MappedKeyboardKey;
      if (key in KeyboardMap && KeyboardMap[key] in keysRef.current) {
        const el = keysRef.current[KeyboardMap[key]];
        el.focus();
        el.click();
      }
    }
    document.body.addEventListener("keypress", keyPress);
    return () => document.body.removeEventListener("keypress", keyPress);
  }, [keysRef]);
}

export const Notes = [
  "a",
  "a#",
  "b",
  "c",
  "c#",
  "d",
  "d#",
  "e",
  "f",
  "f#",
  "g",
  "g#",
] as const;
export type Note = typeof Notes[number];

export const allNotes = Array(88)
  .fill(null)
  .map((_, i) => ({
    note: Notes[i % 12],
    octave: Math.floor((i + 9) / 12),
  }));

type KeyProps = {
  note: Note;
  octave: number;
  onPlay?(note: string, el: HTMLButtonElement): void;
  active?: boolean;
};
const Key = forwardRef<HTMLButtonElement, KeyProps>(function Key(
  { note, octave, onPlay, active },
  ref
) {
  return (
    <button
      ref={ref}
      name="playNote"
      value={`${note}${octave}`}
      autoFocus={active}
      className={[
        "key",
        `key--${note.replace("#", "sharp")}`,
        note.endsWith("#") && "key--ebony",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={(e) => {
        const el = e.target as HTMLButtonElement;
        onPlay?.(`${note}${octave}`, el);
        setTimeout(() => {
          if (document.activeElement === el) el.blur();
        }, 0);
      }}
    />
  );
});
