import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { getNotesDirectory, recordedNote } from "~/utils/notes.server";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { useRef, useEffect } from "react";
import { play, getSynth } from "~/utils/instruments.client";
import { audioBufferToMp3 } from "~/utils/transforms";
import * as Tone from "tone";

/*
 * Callouts:
 *  - resource route
 *  - full stack component
 */

/** Record a client rendered note so we can use it later as an <audio> src */
export async function action({ request, params: { note } }: ActionArgs) {
  if (!note?.match(/^[a-g]#?\d$/))
    return json({ error: "invalid note" }, { status: 422 });

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: () => note,
      directory: getNotesDirectory(),
      filter: ({ name }) => name === "note",
    }),
    unstable_createMemoryUploadHandler()
  );

  await unstable_parseMultipartFormData(request, uploadHandler);
  recordedNote(note);
  return null;
}

export function RecordMissingNote({
  note,
  onProgress,
}: {
  note: string;
  onProgress(amount: number): void;
}) {
  const fetcher = useFetcher();
  const state = useRef<"idle" | "recording" | "uploading" | "done">("idle");

  if (fetcher.state === "submitting") state.current = "uploading";
  else if (fetcher.state === "idle" && state.current === "uploading") {
    state.current = "done";
    onProgress(0.1);
  }

  useEffect(() => {
    if (fetcher.type !== "init" || state.current !== "idle") return;
    state.current = "recording";

    (async () => {
      const buffer = await Tone.Offline(() => play(note, getSynth()), 1);
      const formData = new FormData();
      formData.append("note", await audioBufferToMp3(buffer.get()!));
      onProgress(0.9);
      fetcher.submit(formData, {
        method: "post",
        action: `/notes/${encodeURIComponent(note)}`,
        encType: "multipart/form-data",
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

let playbackMode: "dynamic" | "static" = "static";

/**
 * Play the given note(s), either via <audio> elements or imperatively (depending on capabilities)
 */
export function Playback({
  notes,
  buster,
}: {
  notes: string[];
  buster?: string;
}) {
  useEffect(() => {
    if (notes.length === 0) playbackMode = "dynamic";
  }, [notes.length]);

  const { host } = (useRouteLoaderData("root") ?? {}) as unknown as {
    host: string;
  };

  const currentPlayback = useRef<string>();
  if (playbackMode === "dynamic") {
    if (currentPlayback.current !== buster) {
      currentPlayback.current = buster;
      notes.forEach((note) => play(note));
    }
    return null;
  } else {
    return (
      <>
        {notes.map((note) => (
          <audio
            key={`${note}${buster}`}
            autoPlay={true}
            src={getNoteURI(note, host)}
          />
        ))}
      </>
    );
  }
}

export function getNoteURI(note: string, host?: string) {
  const base =
    host && process.env.NODE_ENV === "production"
      ? `//${host.replace(/:\d+$/, "")}:3001`
      : "";
  return `${base}/notes/${encodeURIComponent(note)}`;
}
