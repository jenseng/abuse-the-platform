import type { LoaderArgs } from "@remix-run/node";
import { Emitter } from "~/utils/emitter";
import { singleton } from "~/utils/singleton";
import type { Data } from "../multiplayer";
import { getNotes } from "../multiplayer";

export const longPollEmitter = singleton(
  "longPollEmitter",
  new Emitter<Data>()
);

export async function loader({ request }: LoaderArgs) {
  return longPollAudio(request, (send, close) => {
    let active = true;
    setTimeout(() => {
      if (active) {
        send(
          `<meta http-equiv="refresh" content="0;URL=${`/multiplayer/longpoll?_data&since=${Date.now()}`}" />`
        );
        close();
      }
    }, 60_000);

    const query = new URL(request.url).searchParams;
    const now = Date.now();

    // play anything that came between the end of the previous long-poll and now
    if (query.has("since")) {
      for (const note of getNotes(parseInt(query.get("since")!), now)) {
        send(
          `<audio autoplay src="/notes/${encodeURIComponent(note)}"></audio>`
        );
      }
    }
    // play new notes that come along
    function handleEvent(data: Data) {
      for (const note of data.notes) {
        send(
          `<audio autoplay src="/notes/${encodeURIComponent(note)}"></audio>`
        );
      }
    }
    longPollEmitter.addListener(handleEvent);
    return () => {
      active = false;
      longPollEmitter.removeListener(handleEvent);
    };
  });
}

type CleanupFunction = () => void;
type SendFunction = (markup: string) => void;

function longPollAudio(
  request: Request,
  init: (send: SendFunction, close: () => void) => CleanupFunction
) {
  const headers = new Headers();
  headers.set("Connection", "keep-alive");
  headers.set("Content-Type", "text/html");
  headers.set("Cache-Control", "no-store, no-transform");

  const stream = new ReadableStream({
    start(controller) {
      function send(markup: string) {
        controller.enqueue(`${markup}\n`);
      }
      const cleanup = init(send, close);

      let closed = false;
      function close() {
        if (closed) return;
        cleanup();
        closed = true;
        request.signal.removeEventListener("abort", close);
        controller.close();
      }
      request.signal.addEventListener("abort", close);
      if (request.signal.aborted) close();
    },
  });
  return new Response(stream, {
    headers,
    status: 200,
  });
}