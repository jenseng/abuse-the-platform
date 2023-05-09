export function LongPollPlayback() {
  // long poll iframe that renders <audio> elements
  return (
    <iframe
      style={{ position: "absolute", visibility: "hidden" }}
      name="longpoll"
      src="/multiplayer/longpoll?_data"
      allow="autoplay"
      title="🙈"
    ></iframe>
  );
}
