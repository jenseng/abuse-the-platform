import styles from "~/styles/app.css";
import type { ActionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function action({ request }: ActionArgs) {
  return {};
}

export default function Index() {
  return (
    <ul>
      <li>
        <Link to="/clientSide">Client Side</Link>
      </li>
      <li>
        <Link to="/serverSide">Server Side</Link>
      </li>
    </ul>
  );
}
