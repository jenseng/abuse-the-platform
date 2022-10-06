import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useActionData,
  useFetcher,
  useSearchParams,
} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Piano } from "~/components/Piano";
import { singleton } from "~/utils/singleton";
import { Playback } from "../notes/$note";
import { emitter } from "./multiplayer/stream";

/*
 * Callouts:
 *  - fetcher.Form
 *  - EventSource / server-sent events
 *  - "Works" without JS \o/
 *    - <noscript>
 *    - <meta>
 */

export type Data = {
  notes: string[];
  timestamp: number;
};
const session: Data[] = singleton("session", []);

export function getNotes(since: number, until: number) {
  // TODO: rather than discard old stuff, have the ability to rewind/replay,
  // in which case the linear filtering is not ideal
  const cutoff = session.findIndex(
    ({ timestamp }) => timestamp >= Date.now() - 10_000
  );
  if (cutoff > 0) session.splice(0, cutoff);

  return session
    .filter(({ timestamp }) => timestamp > since && timestamp <= until)
    .map(({ notes }) => notes)
    .flat();
}

export async function action({ request }: ActionArgs) {
  const query = new URL(request.url).searchParams;
  const formData = await request.formData();
  if (formData.has("playNote")) {
    const data = {
      notes: [formData.get("playNote") as string],
      timestamp: Date.now(),
    };
    session.push(data);
    emitter.emit(data);
  }
  const now = Date.now();
  const notes = query.has("since")
    ? getNotes(parseInt(query.get("since")!), now)
    : [];
  // can we exclude our own notes from the stream?
  return json<Data>({ notes, timestamp: now });
}

export async function loader({ request }: LoaderArgs) {
  const query = new URL(request.url).searchParams;
  const now = Date.now();
  // can we exclude our own notes from the response?
  const notes = query.has("since")
    ? getNotes(parseInt(query.get("since")!), now)
    : [];
  return json<Data>({ notes: notes, timestamp: now });
}

// if hydration doesn't happen before this point, we'll start polling
const POLL_DELAY = 5;
const POLL_FREQUENCY = 0.5;

export default function Index() {
  const { notes, timestamp, isStreaming } = useNotesData();

  const fetcher = useFetcher();
  const [query] = useSearchParams();

  return (
    <>
      <Link to="/">&laquo; Back</Link>
      <h2>Multiplayer Piano</h2>
      <fetcher.Form method="post" action={`/multiplayer?since=${timestamp}`}>
        <Piano activeNotes={notes} />
      </fetcher.Form>
      <Playback notes={notes} buster={String(timestamp)} />

      {!isStreaming && (
        <>
          <noscript>
            {/* TODO: figure out if we can make this work *before* JS; the tricky thing is that once you add a meta
                        refresh el to the DOM, the refresh can't be canceled
                */}
            <meta
              httpEquiv="refresh"
              content={`${
                query.has("since") ? POLL_FREQUENCY : POLL_DELAY
              };URL='${`/multiplayer?since=${timestamp}`}'`}
            />
          </noscript>
        </>
      )}
    </>
  );
}

function useNotesData() {
  const loaderData = useLoaderData<Data>();
  const actionData = useActionData<Data>();
  const streamData = useEventStream<Data>("/multiplayer/stream");

  const [isStreaming, setIsStreaming] = useState(false);
  useEffect(() => setIsStreaming(true), []);

  return { ...(streamData ?? actionData ?? loaderData), isStreaming };
}

// H/T https://twitter.com/ryanflorence/status/1533437211714080768
// and https://github.com/remix-run/remix/discussions/2622
function useEventStream<T>(href: string) {
  let [data, setData] = useState<T>();
  useEffect(() => {
    let eventSource = new EventSource(href);
    eventSource.addEventListener("playNotes", handler);
    function handler(event: MessageEvent) {
      setData(JSON.parse(event.data));
    }
    return () => {
      eventSource.removeEventListener("playNotes", handler);
    };
  }, [href]);
  return data;
}
