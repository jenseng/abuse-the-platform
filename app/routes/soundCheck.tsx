import { VolumeSlider } from "~/components/volumeSlider";
import { play } from "~/utils/instruments.client";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function playNotes(...notes: string[]) {
  for (const note of notes) {
    play(note);
  }
}

const n8 = 300;
const n4 = n8 * 2;
export default function Index() {
  return (
    <>
      <h1>Sound Check</h1>
      <VolumeSlider style={{}} />
      <br />
      <button
        onClick={async () => {
          playNotes("d4", "f4", "g4", "a#4");
          await sleep(400);
          playNotes("d4", "f4", "g4", "a#4");
          await sleep(400);
          playNotes("d4", "f4", "g4", "a#4");
          await sleep(400);
          playNotes("d4", "f4", "g4", "a#4");
          await sleep(800);
          playNotes("d4", "f4", "g4", "a#4");
          await sleep(1200);
          playNotes("c4", "e4", "g4", "a#4");
          await sleep(400);
          playNotes("c4", "e4", "g4", "a#4");
          await sleep(400);
          playNotes("d4", "f4", "g4", "a#4");
          await sleep(400);
          playNotes("c4", "e4", "g4", "a#4");
          await sleep(400);
          playNotes("c4", "e4", "g4", "a#4");
          await sleep(400);
          playNotes("a#3", "c4", "e4", "g4");
          await sleep(1200);
          playNotes("c4", "d#4", "f4", "a4");
          await sleep(400);
          playNotes("c4", "d#4", "f4", "a4");
          await sleep(400);
          playNotes("c4", "d#4", "f4", "a4");
          await sleep(400);
          playNotes("c4", "d#4", "g4", "a#4");
          await sleep(800);
          playNotes("c4", "d#4", "f4", "a4");
          await sleep(800);
          playNotes("f3", "f4");
          await sleep(400);
          playNotes("f3", "f4");
          await sleep(400);
          playNotes("a#3", "d4", "f4", "a#4");
          await sleep(400);
          playNotes("a#3", "d4", "f4", "a#4");
          await sleep(400);
          playNotes("c4", "d#4", "g4", "a#4");
          await sleep(400);
          playNotes("a#3", "d4", "f4", "a#4");
          await sleep(400);
          playNotes("a3", "d4", "f4", "a4");
          await sleep(400);
          playNotes("f3", "a#3", "d4", "f4");
        }}
      >
        Go
      </button>
    </>
  );
}
