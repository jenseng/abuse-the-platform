import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Piano } from "~/components/piano";
import { getMissingNotes } from "~/utils/notes.server";

export async function loader({ request }: LoaderArgs) {
  if ((await getMissingNotes()).length) {
    return redirect("/notes/recordMissing");
  }
  const query = new URL(request.url).searchParams;
  return json({ playNote: query.get("playNote"), buster: query.get("buster") });
}

export default function Index() {
  const { playNote, buster } = useLoaderData<typeof loader>();
  return (
    <Form>
      <Piano activeNote={playNote ?? undefined} />
      {playNote && (
        <audio autoPlay key={`${playNote}${buster}`}>
          <source src={`/notes/${encodeURIComponent(playNote)}`} />
        </audio>
      )}
      <input type="hidden" value={Math.random()} name="buster" />
    </Form>
  );
}
