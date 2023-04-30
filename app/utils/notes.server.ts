import globby from "globby";
import * as path from "path";
import { allNotes } from "~/components/piano";

export async function getRecordedNotes() {
  return new Set(await globby("*", { cwd: getNotesDirectory() }));
}

export async function getMissingNotes() {
  const recordedNotes = await getRecordedNotes();
  const expectedNotes = allNotes.map(({ note, octave }) => `${note}${octave}`);
  return expectedNotes.filter((note) => !recordedNotes.has(note));
}

export function getNotesDirectory() {
  return path.join(process.cwd(), "public/notes");
}
