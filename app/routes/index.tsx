import styles from "~/styles/app.css";
import { Link } from "@remix-run/react";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  return (
    <>
      <h1>(Ab)use the Platform!</h1>
      <ul>
        <li>
          <b>Single Player Pianos</b>
          <ul>
            <li>
              <Link to="/clientSide/singlePlayer">Client-side</Link>
            </li>
            <li>
              <Link to="/progressive/singlePlayer">Progressive</Link>
            </li>
          </ul>
        </li>
        <li>
          <b>Multiplayer Pianos</b>
          <ul>
            <li>
              <Link to="/clientSide/multiplayer">Client-side</Link>
            </li>
            <li>
              <Link to="/progressive/multiplayer">Progressive</Link>
            </li>
          </ul>
        </li>
      </ul>
    </>
  );
}
