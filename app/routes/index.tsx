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
      <ul>
        <li>
          🌑🌑🌑🌑🌑 <Link to="/noOp">No-op Piano</Link>
        </li>
        <li>
          🌕🌑🌑🌑🌑{" "}
          <Link to="/clientSide/singlePlayer">
            Single Player Client-side Piano
          </Link>
        </li>
        <li>
          🌕🌕🌕🌑🌑{" "}
          <Link to="/progressive/singlePlayer">
            Single Player Progressive Piano
          </Link>
        </li>
        <li>
          🌕🌕🌕🌗🌑{" "}
          <Link to="/clientSide/multiplayer">
            Multiplayer Client-side Piano
          </Link>
        </li>
        <li>
          🌕🌕🌕🌕🌗{" "}
          <Link to="/progressive/multiplayer">
            Multiplayer Progressive Piano
          </Link>{" "}
          🥳
        </li>
      </ul>
    </>
  );
}
