import { Link } from "@remix-run/react";
import { Piano } from "~/components/Piano";
import { play } from "~/utils/instruments.client";

/*
 * Callouts:
 *  - Web Audio, Tone.js
 */
export default function Index() {
  return (
    <>
      <Link to="/">&laquo; Back</Link>

      <h2>Client-side Piano</h2>

      <p>Play by yourself</p>

      <Piano onPlayNote={(note) => play(note)} />
    </>
  );
}
