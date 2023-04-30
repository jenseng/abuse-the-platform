import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { PropsWithChildren } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { getMissingNotes } from "~/utils/notes.server";
import { RecordMissingNote } from "./notes/$note";

export async function loader({ request }: DataFunctionArgs) {
  const missingNotes = await getMissingNotes();
  return json({
    missingNotes,
    isAdmin: request.headers.get("Host") === "localhost:3000", // don't actually do this in a real app, this is so dumb 😂🙈
  });
}
export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) =>
  formAction === "/notes";

/*
 * Callouts:
 *  - <noscript>
 *  - <progress>
 *  - requestAnimationFrame
 *  - full stack component and a resource route
 */
export default function ServerNotes() {
  const { missingNotes, isAdmin } = useLoaderData<typeof loader>();
  const progress = useRef(0);
  const fetcher = useFetcher();
  function isDone() {
    return Math.round(progress.current) === missingNotes.length;
  }

  usePeriodicRerender(100, () => isDone());
  if (isDone()) {
    return (
      <div>
        {isAdmin && (
          <fetcher.Form
            action="/notes"
            method="post"
            style={{ position: "absolute", top: "1em", right: "1em" }}
          >
            <input name="returnTo" type="hidden" value="" />
            <button
              name="intent"
              value="rerecord"
              title="Clear all server-side notes"
            >
              🗑️ Clear recorded notes
            </button>
          </fetcher.Form>
        )}
        <Outlet />
      </div>
    );
  }

  return (
    <>
      {missingNotes.map((note) => (
        <RecordMissingNote
          key={note}
          note={note}
          onProgress={(amount) => (progress.current += amount)}
        />
      ))}

      <YassScript>
        <h2>Hang Tight!</h2>
        <p>
          In order to support a JavaScript-less experience, we're using your
          browser to record some sample for everyone. Thanks! 🙏
        </p>
      </YassScript>

      <noscript>
        <h2>Please enable JavaScript (temporarily)</h2>
        <p>
          While this piano{" "}
          <b>
            <i>can</i>
          </b>{" "}
          work without JavaScript, we first need to generate and save the note
          tones via client-side JavaScript :-/
        </p>
      </noscript>
      <progress
        max={missingNotes.length}
        value={Math.round(progress.current)}
      />
    </>
  );
}

function YassScript({ children }: PropsWithChildren) {
  const [hydrated, setHydrated] = useState(false);
  useYoloLayoutEffect(() => {
    setHydrated(true);
  }, []);
  return <>{hydrated ? children : null}</>;
}
const useYoloLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function usePeriodicRerender(delay: number, stopFn: () => boolean) {
  const [, flush] = useState<number>();
  useEffect(() => {
    let request: number;
    let previousRenderTimestamp = 0;
    function refresh(timestamp: number) {
      if (timestamp - previousRenderTimestamp >= delay) {
        flushSync(() => flush(Math.random()));
        previousRenderTimestamp = timestamp;
      }
      if (!stopFn()) request = requestAnimationFrame(refresh);
    }

    request = requestAnimationFrame(refresh);
    return () => cancelAnimationFrame(request);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);
}
