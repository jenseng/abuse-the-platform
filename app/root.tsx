import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useSearchParams,
} from "@remix-run/react";
import styles from "~/styles/app.css";
import { Rickord } from "~/components/rickord";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Piano 🎹",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = ({ request }: LoaderArgs) => {
  return json({ host: String(request.headers.get("host")) });
};

export default function App() {
  const [query] = useSearchParams();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={query.has("iframe") ? "iframe" : ""}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Rickord />
      </body>
    </html>
  );
}
