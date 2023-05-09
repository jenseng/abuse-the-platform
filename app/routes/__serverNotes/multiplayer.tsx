import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Piano } from "~/components/piano";
import { MultiSubmitForm } from "~/components/multiSubmitForm";
import { singleton } from "~/utils/singleton";
import { Playback } from "../notes/$note";
import { streamEmitter } from "./multiplayer/stream";
import { longPollEmitter } from "./multiplayer/longpoll";
import { NoteViz } from "~/components/noteViz";

/*
 * Callouts:
 *  - fetcher
 *  - EventSource / server-sent events
 *  - "Works" without JS \o/
 *    - <iframe> and long polling
 *    - <audio>
 *    - <meta>
 */

export type Data = {
  notes: string[];
  timestamp: number;
};
// "session" in the sense of a "jam session" where musicians are playing together :)
const session: Data[] = singleton("session", []);

export function getNotes(since: number, until: number) {
  // TODO: rather than discard old stuff, have the ability to rewind/replay,
  // in which case the linear filtering is not ideal
  return session
    .filter(({ timestamp }) => timestamp > since && timestamp <= until)
    .map(({ notes }) => notes)
    .flat();
}

// just keep a sliding window of recent notes
export const SESSION_LENGTH = 10_000;

export function truncateSession(session: Data[]) {
  const cutoffMs = Date.now() - SESSION_LENGTH;
  let cutoff = 0;
  while (session[cutoff] && session[cutoff].timestamp < cutoffMs) cutoff++;
  if (cutoff > 0) session.splice(0, cutoff);
  return session;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  if (formData.has("playNote")) {
    const data = {
      notes: formData.getAll("playNote") as string[],
      timestamp: Date.now(),
    };
    truncateSession(session);
    session.push(data);
    streamEmitter.emit(data);
    longPollEmitter.emit(data);
  }
  return json({});
}

export async function loader() {
  return json({ initialData: session });
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function Index() {
  const fetcher = useFetcher();
  const { initialData } = useLoaderData<typeof loader>();
  const currentData = useEventStream<Data>("/multiplayer/stream");
  const { notes, timestamp } = currentData ?? {};
  const buster = String(timestamp);
  const isHydrated = useIsHydrated();

  return (
    <>
      <Link to="/">&laquo; Back</Link>

      <h2>Multiplayer Piano</h2>
      <p>Jam with your friends, with or without JavaScript.</p>

      <MultiSubmitForm
        method="post"
        submit={fetcher.submit}
        // these will only be used before/without JavaScript
        target={longPollPost}
        action="/multiplayer?_data"
      >
        <Piano activeNotes={notes} buster={buster} />
      </MultiSubmitForm>

      {isHydrated ? (
        <Playback notes={notes} buster={buster} />
      ) : (
        <>
          <LongPollPlayback />
        </>
      )}

      {isHydrated ? (
        <NoteViz
          initialData={initialData}
          currentData={currentData}
          windowSize={SESSION_LENGTH}
        />
      ) : (
        <iframe
          src="/multiplayer/noteViz?iframe"
          style={{ width: "100%", height: 160, border: 0 }}
          title="😂"
        ></iframe>
      )}
    </>
  );
}

function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);
  return isHydrated;
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

const longPollPost = "longpollPost";
function LongPollPlayback() {
  return (
    <>
      {/* long poll iframe that renders <audio> elements */}
      <iframe
        style={{ position: "absolute", visibility: "hidden" }}
        name="longpoll"
        src="/multiplayer/longpoll?_data"
        allow="autoplay"
        title="🙈"
      ></iframe>
      {/* form target for when we play a note, so we don't refresh the page */}
      <iframe
        style={{ position: "absolute", visibility: "hidden" }}
        src="about:blank"
        name={longPollPost}
        title="🙈"
      ></iframe>
    </>
  );
}
