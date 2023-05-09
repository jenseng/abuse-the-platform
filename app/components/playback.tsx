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

  const { assetHost } = (useRouteLoaderData("root") ?? {}) as unknown as {
    assetHost: string;
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
            src={`//${assetHost}/notes/${encodeURIComponent(note)}`}
          />
        ))}
      </>
    );
  }
}
