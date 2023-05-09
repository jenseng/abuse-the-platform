import globby from "globby";
import * as fs from "fs";
import * as path from "path";
import { allNotes } from "~/components/piano";

const recordedNotes = new Set(
  globby
    .sync("*", { cwd: getNotesDirectory() })
    .filter((f) => f.match(/^([acdfg]#?|[be])[0-8]$/))
);

export function reRecordAllNotes() {
  if (process.env.NODE_ENV === "development") {
    // need to remove the actual files, since this module is reloaded on every request in dev mode
    for (const note of recordedNotes) {
      fs.rmSync(path.join(getNotesDirectory(), note), { force: true });
    }
  }
  recordedNotes.clear();
}

export function recordedNote(note: string) {
  recordedNotes.add(note);
}

export async function getMissingNotes() {
  const expectedNotes = allNotes.map(({ note, octave }) => `${note}${octave}`);
  return expectedNotes.filter((note) => !recordedNotes.has(note));
}

export function getNotesDirectory() {
  return path.join(process.cwd(), "public/notes");
}

export function getAssetHost(request: Request) {
  return String(process.env.ASSET_HOST ?? request.headers.get("host"));
}
