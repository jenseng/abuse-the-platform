import { Form, Link, useSearchParams } from "@remix-run/react";
import { Piano } from "~/components/Piano";
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
  return (
    <>
      <Link to="/">&laquo; Back</Link>

      <h2>Progressive Piano</h2>

      <Form>
        <Piano activeNotes={playNote ? [playNote] : []} />
        <input type="hidden" value={Math.random()} name="buster" />
      </Form>
      <Playback
        notes={playNote ? [playNote] : []}
        buster={query.get("buster") ?? ""}
      />
    </>
  );
}
