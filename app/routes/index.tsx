import styles from "~/styles/app.css";
import * as Tone from "tone";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  return <Piano />;
}

function Piano() {
  return (
    <div className="piano">
      {Array(88)
        .fill(null)
        .map((_, i) => i)
        .filter((i) => i >= 24 && i < 64)
        .map((i) => (
          <Key key={i} value={i} />
        ))}
    </div>
  );
}

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

type KeyProps = { value: number };
function Key({ value }: KeyProps) {
  const noteName = Notes[value % 12];
  return (
    <button
      className={[
        "key",
        `key--${noteName.replace("#", "sharp")}`,
        noteName.endsWith("#") && "key--ebony",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => play(noteName, Math.floor((value + 9) / 12))}
    />
  );
}

const synth: Tone.Synth =
  typeof window != "undefined" ? new Tone.Synth().toDestination() : ({} as any);
function play(noteName: string, octave: number) {
  synth.triggerAttackRelease(`${noteName}${octave}`, "8n");
}
