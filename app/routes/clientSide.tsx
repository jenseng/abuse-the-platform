import { Piano, play } from "~/components/piano";

export default function Index() {
  return (
    <Piano
      onPlayNote={(note, el) => {
        play(note);
        setTimeout(() => {
          if (document.activeElement === el) el.blur();
        }, 100);
      }}
    />
  );
}
