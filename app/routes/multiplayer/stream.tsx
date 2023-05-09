import type { LoaderArgs } from "@remix-run/node";
import type { Data } from "~/data";
import { Emitter } from "~/utils/emitter";
import { singleton } from "~/utils/singleton";

export const streamEmitter = singleton("streamEmitter", new Emitter<Data>());

export async function loader({ request }: LoaderArgs) {
  return eventStream(request, (send) => {
    function handleEvent(data: Data) {
      send("playNotes", JSON.stringify(data));
    }
    streamEmitter.addListener(handleEvent);
    return () => {
      streamEmitter.removeListener(handleEvent);
    };
  });
}

type CleanupFunction = () => void;
type SendFunction = (event: string, data: string) => void;

// H/T https://twitter.com/ryanflorence/status/1533437211714080768
// and https://github.com/remix-run/remix/discussions/2622

function eventStream(
  request: Request,
  init: (send: SendFunction) => CleanupFunction
) {
  const headers = new Headers();
  headers.set("Connection", "keep-alive");
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-store, no-transform");

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      function send(event: string, data: string) {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }
      const cleanup = init(send);

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
