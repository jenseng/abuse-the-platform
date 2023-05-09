import { useLoaderData } from "@remix-run/react";
import { NoteViz } from "~/components/noteViz";
import type { Data } from "../__serverNotes/multiplayer";
import {
  SESSION_LENGTH,
  loader as mpLoader,
} from "../__serverNotes/multiplayer";

export const loader = mpLoader;
export default function Index() {
  const { initialData } = useLoaderData<typeof loader>() as {
    initialData: Data[];
  };

  return (
    <>
      <NoteViz initialData={initialData} windowSize={SESSION_LENGTH} />
      <meta http-equiv="refresh" content="1;URL=/multiplayer/noteViz?iframe" />
    </>
  );
}
