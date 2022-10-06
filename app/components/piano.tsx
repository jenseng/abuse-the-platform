import { forwardRef, useEffect, useRef } from "react";
import type * as Tone from "tone";
import { getSynth } from "~/utils/instruments.client";

export function Piano({
  onPlayNote,
  activeNote,
}: {
  onPlayNote?(note: string, el: HTMLButtonElement): void;
  activeNote?: string;
}) {
  const keysRef = useRef<Record<string, HTMLButtonElement>>({});
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
  }, []);

  useEffect(() => {
    if (activeNote) {
      if (activeNote in keysRef.current) keysRef.current[activeNote].focus();
    } else if (document.activeElement instanceof HTMLButtonElement) {
      document.activeElement.blur();
    }
  }, [activeNote]);

  return (
    <div className="piano">
      {allNotes
        .filter((_, i) => i >= 24 && i < 64) // just keep the middle notes
        .map(({ note, octave }) => (
          <Key
            key={`${note}${octave}`}
            note={note}
            octave={octave}
            onPlay={onPlayNote}
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
};
const Key = forwardRef<HTMLButtonElement, KeyProps>(function Key(
  { note, octave, onPlay },
  ref
) {
  return (
    <button
      ref={ref}
      name="playNote"
      type="submit"
      value={`${note}${octave}`}
      className={[
        "key",
        `key--${note.replace("#", "sharp")}`,
        note.endsWith("#") && "key--ebony",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={(e) =>
        onPlay?.(`${note}${octave}`, e.target as HTMLButtonElement)
      }
    />
  );
});

const defaultSynth: Tone.Synth =
  typeof window != "undefined" ? getSynth() : ({} as any);

export function play(note: string, synth = defaultSynth) {
  synth.triggerAttackRelease(note, "8n");
}
