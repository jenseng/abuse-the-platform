import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Piano } from "~/components/piano";
import { MultiSubmitForm } from "~/components/multiSubmitForm";
import { NoteViz } from "~/components/noteViz";
import type { Data } from "~/data";
import { pushNotes } from "~/data";
import { session, SESSION_LENGTH } from "~/data";
import { useEventStream } from "~/hooks/useEventStream";
import { Playback } from "~/components/playback";

/*
 * Callouts:
 *  - fetcher
 *  - EventSource / server-sent events
 *  - "Works" without JS \o/
 *    - <iframe> and long polling
 *    - <audio>
 *    - <meta>
 */

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  if (formData.has("playNote")) {
    pushNotes(formData.getAll("playNote").map(String));
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

  return (
    <>
      <Link to="/">&laquo; Back</Link>

      <h2>Client-side Multiplayer Piano</h2>
      <p>Jam with your friends with JavaScript.</p>

      <MultiSubmitForm method="post" submit={fetcher.submit}>
        <Piano activeNotes={notes} buster={buster} />
      </MultiSubmitForm>

      <Playback notes={notes} buster={buster} />

      <NoteViz
        initialData={initialData}
        currentData={currentData}
        windowSize={SESSION_LENGTH}
      />
    </>
  );
}
