import { useRouteLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { play } from "~/utils/instruments.client";

let playbackMode: "dynamic" | "static" = "static";

/**
 * Play the given note(s), either via <audio> elements or imperatively (depending on capabilities)
 */
export function Playback({
  notes = [],
  buster,
}: {
  notes?: string[];
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
