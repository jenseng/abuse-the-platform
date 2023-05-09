import { longPollEmitter } from "~/routes/multiplayer/longpoll";
import { streamEmitter } from "~/routes/multiplayer/stream";
import { singleton } from "~/utils/singleton";

export type Data = {
  notes: string[];
  timestamp: number;
};

// "session" in the sense of a "jam session" where musicians are playing together :)
export const session: Data[] = singleton("session", []);

export function getNotes(since: number, until: number) {
  // TODO: rather than discard old stuff, have the ability to rewind/replay,
  // in which case the linear filtering is not ideal
  return session
    .filter(({ timestamp }) => timestamp > since && timestamp <= until)
    .map(({ notes }) => notes)
    .flat();
}

export function pushNotes(notes: string[]) {
  const timestamp = Date.now();
  const data = { notes, timestamp };
  truncateSession(session);
  if (session[session.length - 1].timestamp === timestamp) {
    session[session.length - 1].notes = Array.from(
      new Set([...session[session.length - 1].notes, ...notes])
    );
  } else {
    session.push(data);
  }
  streamEmitter.emit(data);
  longPollEmitter.emit(data);
}

// just keep a sliding window of recent notes
export const SESSION_LENGTH = 10_000;

export function truncateSession(session: Data[]) {
  const cutoffMs = Date.now() - SESSION_LENGTH;
  let cutoff = 0;
  while (session[cutoff] && session[cutoff].timestamp < cutoffMs) cutoff++;
  if (cutoff > 0) session.splice(0, cutoff);
  return session;
}
