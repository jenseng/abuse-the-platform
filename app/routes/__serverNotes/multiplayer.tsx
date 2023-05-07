import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Piano } from "~/components/piano";
import { MultiSubmitForm } from "~/components/multiSubmitForm";
import { singleton } from "~/utils/singleton";
import { Playback } from "../notes/$note";
import { streamEmitter } from "./multiplayer/stream";
import { longPollEmitter } from "./multiplayer/longpoll";

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
  const formData = await request.formData();
  if (formData.has("playNote")) {
    const data = {
      notes: formData.getAll("playNote") as string[],
      timestamp: Date.now(),
    };
    session.push(data);
    streamEmitter.emit(data);
    longPollEmitter.emit(data);
  }
  return json({});
}

export default function Index() {
  const fetcher = useFetcher();
  const isHydrated = useIsHydrated();
  const { notes, timestamp } =
    useEventStream<Data>("/multiplayer/stream") ?? {};

  return (
    <>
      <Link to="/">&laquo; Back</Link>

      <h2>Multiplayer Piano</h2>

      <p>Jam with your friends, with or without JavaScript.</p>

      <MultiSubmitForm
        method="post"
        submit={fetcher.submit}
        target="longpollPost"
        action="/multiplayer?_data"
      >
        <Piano activeNotes={notes} buster={String(timestamp)} />
      </MultiSubmitForm>

      {isHydrated ? (
        <Playback notes={notes ?? []} buster={String(timestamp)} />
      ) : (
        <>
          <LongPollPlayback />
          <iframe
            style={{ position: "absolute", visibility: "hidden" }}
            src="about:blank"
            name="longpollPost"
            title="🙈"
          ></iframe>
        </>
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

function LongPollPlayback() {
  return (
    <iframe
      style={{ position: "absolute", visibility: "hidden" }}
      name="longpoll"
      src="/multiplayer/longpoll?_data"
      allow="autoplay"
      title="🙈"
    ></iframe>
  );
}
