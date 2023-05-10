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
import { useIsHydrated } from "~/hooks/useIsHydrated";
import { Playback } from "~/components/playback";
import { LongPollPlayback } from "~/components/longPollPlayback";
import { HiddenTarget, hiddenTarget } from "~/components/hiddenTarget";
import { NoteVizIframe } from "../noteViz";
import { VolumeSlider } from "~/components/volumeSlider";

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
  const isHydrated = useIsHydrated();

  return (
    <>
      <Link to="/" className="back-link">
        Back
      </Link>

      <h1>Multiplayer Progressive Piano</h1>
      <h2>Jam with your friends, with or without JavaScript</h2>
      <VolumeSlider />
      <ul>
        <li>✅ Web-based musical instrument</li>
        <li>🚧 Recording and playback</li>
        <li>✅ "Works" without/before JavaScript</li>
        <li>✅ Multiple players</li>
        <li>✅ Real-time visualizations</li>
      </ul>

      <MultiSubmitForm
        method="post"
        submit={fetcher.submit}
        // these will only be used before/without JavaScript
        target={hiddenTarget}
        action="/progressive/multiplayer?_data"
      >
        <Piano activeNotes={notes} buster={buster} />
      </MultiSubmitForm>

      {isHydrated ? (
        <>
          <Playback notes={notes} buster={buster} />
          <NoteViz
            initialData={initialData}
            currentData={currentData}
            windowSize={SESSION_LENGTH}
          />
        </>
      ) : (
        <>
          <HiddenTarget />
          <LongPollPlayback />
          <NoteVizIframe />
        </>
      )}
    </>
  );
}
