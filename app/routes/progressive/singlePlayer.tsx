import { Link, useSearchParams } from "@remix-run/react";
import { MultiSubmitForm } from "~/components/multiSubmitForm";
import { Piano } from "~/components/piano";
import { Playback } from "~/components/playback";

/*
 * Callouts:
 *  - "Recording" via browser history
 *  - Works before/without JS \o/
 */

export default function Index() {
  const [query] = useSearchParams();
  const playNotes = query.getAll("playNote");
  const buster = query.get("buster") ?? "";
  return (
    <>
      <Link to="/">&laquo; Back</Link>

      <h2>Progressive Single-player Piano</h2>
      <p>
        Play by yourself, with or without JavaScript. "Record" a song with your
        browser history.
      </p>

      <MultiSubmitForm>
        <Piano activeNotes={playNotes} buster={buster} />
        <input type="hidden" value={Math.random()} name="buster" />
      </MultiSubmitForm>
      <Playback notes={playNotes} buster={buster} />
    </>
  );
}
