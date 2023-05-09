import { Link } from "@remix-run/react";
import { Piano } from "~/components/piano";
import { VolumeSlider } from "~/components/volumeSlider";
import { play } from "~/utils/instruments.client";

/*
 * Callouts:
 *  - Web Audio, Tone.js
 */
export default function Index() {
  return (
    <>
      <Link to="/" className="back-link">
        Back
      </Link>

      <h1>Single-player Client-side Piano</h1>
      <h2>Play by yourself</h2>
      <VolumeSlider />
      <ul>
        <li>✅ Web-based musical instrument</li>
        <li>❌ Recording and playback</li>
        <li>❌ "Works" without/before JavaScript</li>
        <li>❌ Multiple players</li>
        <li>❌ Real-time visualizations</li>
      </ul>

      <Piano onPlayNote={(note) => play(note)} />
    </>
  );
}
