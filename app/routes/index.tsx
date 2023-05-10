import styles from "~/styles/app.css";
import { Link } from "@remix-run/react";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  return (
    <>
      <h1>(Ab)use the Platform!</h1>
      <h2>a.k.a. Building a Multiplayer Piano the "Wrong" Way</h2>

      <h3>The Checklist</h3>
      <ul>
        <li>
          <input type="checkbox" /> Web-based musical instrument
        </li>
        <li>
          <input type="checkbox" /> Recording and playback
        </li>
        <li>
          <input type="checkbox" /> "Works" without/before JavaScript
        </li>
        <li>
          <input type="checkbox" /> Multiple players
        </li>
        <li>
          <input type="checkbox" /> Real-time visualizations
        </li>
      </ul>

      <h3>The Pianos</h3>
      <ul>
        <li>
          <Link to="/noOp">No-op Piano</Link> 🙉
        </li>
        <li>
          <Link to="/clientSide/singlePlayer">
            Single Player Client-side Piano
          </Link>{" "}
          🙂🎵
        </li>
        <li>
          <Link to="/progressive/singlePlayer">
            Single Player Progressive Piano
          </Link>{" "}
          😄🎵
        </li>
        <li>
          <Link to="/clientSide/multiplayer">
            Multiplayer Client-side Piano
          </Link>{" "}
          😄😄🎶
        </li>
        <li>
          <Link to="/progressive/multiplayer">
            Multiplayer Progressive Piano
          </Link>
          👩‍🎤👨‍🎤🙌🎶
        </li>
      </ul>
    </>
  );
}
