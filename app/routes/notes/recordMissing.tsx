import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useRef, useState, useEffect } from "react";
import * as Tone from "tone";
import { play } from "~/components/piano";
import { getSynth } from "~/utils/instruments.client";
import { getMissingNotes } from "~/utils/notes.server";
import { audioBufferToMp3 } from "~/utils/transforms";

export async function loader({ request }: LoaderArgs) {
  const missingNotes = await getMissingNotes();
  return json({ missingNotes });
}

export default function RecordMissing() {
  const progress = useRef(0);
  const [_, setProgress] = useState(progress.current);
  const { missingNotes } = useLoaderData<typeof loader>();

  return (
    <>
      {missingNotes.map((note) => (
        <RecordMissingNote
          key={note}
          note={note}
          onComplete={() => setProgress(++progress.current)}
        />
      ))}
      <progress max={missingNotes.length} value={progress.current} />
    </>
  );
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
  return !submission;
};

function RecordMissingNote({
  note,
  onComplete,
}: {
  note: string;
  onComplete(): void;
}) {
  const fetcher = useFetcher();
  const recordingStarted = useRef<boolean>(false);
  const uploadingStarted = useRef<boolean>(false);
  const done = useRef<boolean>(false);
  if (fetcher.state === "submitting") uploadingStarted.current = true;
  if (fetcher.state === "idle" && uploadingStarted.current && !done.current) {
    setTimeout(() => {
      done.current = true;
      onComplete();
    });
  }
  useEffect(() => {
    if (fetcher.type !== "init" || recordingStarted.current) return;
    recordingStarted.current = true;

    setTimeout(() => {
      Tone.Offline(() => play(note, getSynth()), 1).then((buffer) => {
        const formData = new FormData();
        formData.append("note", audioBufferToMp3(buffer.get()!));
        fetcher.submit(formData, {
          method: "post",
          action: `/notes/${encodeURIComponent(note)}`,
          encType: "multipart/form-data",
        });
      });
    }, Math.floor(Math.random() * 10_000));
  }, [note, fetcher]);

  return null;
}
