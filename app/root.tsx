import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
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
import { getAssetHost } from "./utils/notes.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Piano 🎹",
  viewport: "width=device-width,initial-scale=1",
});

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export const loader = ({ request }: LoaderArgs) => {
  return json({
    host: String(
      process.env.SERVER_HOST
        ? `${process.env.SERVER_HOST}:${process.env.PORT ?? 3000}`
        : request.headers.get("host")
    ),
    assetHost: getAssetHost(request),
    isAdmin: request.headers.get("host") === "localhost:3000", // don't actually do this in a real app, this is so dumb 😂🙈
  });
};

export default function App() {
  const { isAdmin, host } = useLoaderData<typeof loader>();
  const [query] = useSearchParams();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      {query.has("iframe") ? (
        <body className="iframe">
          <Outlet />
        </body>
      ) : (
        <body>
          {isAdmin && <ServerInfo host={host} />}
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <Rickord />
        </body>
      )}
    </html>
  );
}

function ServerInfo({ host }: { host: string }) {
  const [query] = useSearchParams();
  return (
    <div
      style={{
        height: "2em",
        marginTop: "-2em",
        marginBottom: "-2em",
        textAlign: "center",
      }}
    >
      {query.has("showServerInfo") ? (
        <>
          <b>Canonical Server URL:</b> http://{host}
        </>
      ) : (
        <Link to="?showServerInfo">Show Server Info</Link>
      )}
    </div>
  );
}
