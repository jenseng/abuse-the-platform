import { useState, useEffect } from "react";

// H/T https://twitter.com/ryanflorence/status/1533437211714080768
// and https://github.com/remix-run/remix/discussions/2622
export function useEventStream<T>(href: string) {
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
