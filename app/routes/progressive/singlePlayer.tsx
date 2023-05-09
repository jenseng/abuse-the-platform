import { Link, useSearchParams } from "@remix-run/react";
import { MultiSubmitForm } from "~/components/multiSubmitForm";
import { Piano } from "~/components/piano";
import { Playback } from "~/components/playback";
import { VolumeSlider } from "~/components/volumeSlider";

/*
 * Callouts:
 *  - "Recording" via browser history
 *  - Works before/without JS \o/
 */

export default function Index() {
  const [query] = useSearchParams();
  const playNotes = query.getAll("playNote");
  const buster = query.get("buster") ?? "";
  return (
    <>
      <Link to="/" className="back-link">
        Back
      </Link>

      <h1>Single-player Progressive Piano</h1>
      <h2>
        Play by yourself, with or without JavaScript. "Record" a song with your
        browser history.
      </h2>
      <VolumeSlider />
      <ul>
        <li>✅ Web-based musical instrument</li>
        <li>✅ Recording and playback</li>
        <li>✅ "Works" without/before JavaScript</li>
        <li>❌ Multiple players</li>
        <li>❌ Real-time visualizations</li>
      </ul>

      <MultiSubmitForm>
        <Piano activeNotes={playNotes} buster={buster} />
        <input type="hidden" value={Math.random()} name="buster" />
      </MultiSubmitForm>
      <Playback notes={playNotes} buster={buster} />
    </>
  );
}
