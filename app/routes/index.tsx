import styles from "~/styles/app.css";
import * as Tone from "tone";
import { forwardRef, useEffect, useRef } from "react";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  return <Piano />;
}

function Piano() {
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

  return (
    <div className="piano">
      {Array(88)
        .fill(null)
        .map((_, i) => i)
        .filter((i) => i >= 24 && i < 64)
        .map((i) => {
          const note = Notes[i % 12];
          const octave = Math.floor((i + 9) / 12);
          return (
            <Key
              key={i}
              note={note}
              octave={octave}
              ref={(el: HTMLButtonElement) =>
                (keysRef.current[`${note}${octave}`] = el)
              }
            />
          );
        })}
    </div>
  );
}

const KeyboardMap = {
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

const Notes = [
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
type Note = typeof Notes[number];

type KeyProps = { note: Note; octave: number };
const Key = forwardRef<HTMLButtonElement, KeyProps>(function Key(
  { note, octave },
  ref
) {
  return (
    <button
      ref={ref}
      className={[
        "key",
        `key--${note.replace("#", "sharp")}`,
        note.endsWith("#") && "key--ebony",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={(e) => {
        play(note, octave);
        setTimeout(() => {
          if (document.activeElement === e.target)
            (e.target as HTMLButtonElement).blur();
        }, 100);
      }}
    />
  );
});

const synth: Tone.Synth =
  typeof window != "undefined" ? new Tone.Synth().toDestination() : ({} as any);
function play(noteName: string, octave: number) {
  synth.triggerAttackRelease(`${noteName}${octave}`, "8n");
}
