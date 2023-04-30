import { Form, Link, useSearchParams } from "@remix-run/react";
import { Piano } from "~/components/piano";
import { Playback } from "../notes/$note";

/*
 * Callouts:
 *  - Form
 *  - "Recording" via browser history
 *  - Works before/without JS \o/
 */

export default function Index() {
  const [query] = useSearchParams();
  const playNote = query.get("playNote");
  const buster = query.get("buster") ?? "";
  return (
    <>
      <Link to="/">&laquo; Back</Link>

      <h2>Progressive Piano</h2>

      <p>
        Play by yourself, with or without JavaScript. "Record" a song with your
        browser history.
      </p>

      <Form>
        <Piano activeNotes={playNote ? [playNote] : []} buster={buster} />
        <input type="hidden" value={Math.random()} name="buster" />
      </Form>
      <Playback notes={playNote ? [playNote] : []} buster={buster} />
    </>
  );
}
