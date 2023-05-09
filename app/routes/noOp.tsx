import { Link } from "@remix-run/react";
import { Piano } from "~/components/piano";

export default function Index() {
  return (
    <>
      <Link to="/" className="back-link">
        Back
      </Link>

      <h1>No-op Piano</h1>
      <h2>The sounds of silence</h2>
      <ul>
        <li>❌ Web-based musical instrument</li>
        <li>❌ Recording and playback</li>
        <li>❌ "Works" without/before JavaScript</li>
        <li>❌ Multiple players</li>
        <li>❌ Real-time visualizations</li>
      </ul>

      <Piano />
    </>
  );
}
