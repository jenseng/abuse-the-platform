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
          <Link to="/clientSide">Client-side Piano</Link>
        </li>
        <li>
          <Link to="/progressive">Progressive Piano</Link>
        </li>
        <li>
          <Link to="/multiplayer">Multiplayer Piano</Link>
        </li>
      </ul>
    </>
  );
}
