import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function usePeriodicRerender(
  interval: number,
  stopFn: () => boolean = () => false
) {
  const [, flush] = useState<number>();
  useEffect(() => {
    let request: number;
    let previousRenderTimestamp = 0;
    function refresh(timestamp: number) {
      if (timestamp - previousRenderTimestamp >= interval) {
        flushSync(() => flush(Math.random()));
        previousRenderTimestamp = timestamp;
      }
      if (!stopFn()) request = requestAnimationFrame(refresh);
    }

    request = requestAnimationFrame(refresh);
    return () => cancelAnimationFrame(request);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);
}
