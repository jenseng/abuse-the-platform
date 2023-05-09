import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NoteViz } from "~/components/noteViz";
import type { Data } from "~/data";
import { session } from "~/data";
import { SESSION_LENGTH } from "~/data";

export async function loader() {
  return json({ initialData: session });
}

export default function Index() {
  const { initialData } = useLoaderData<typeof loader>() as {
    initialData: Data[];
  };

  return (
    <>
      <NoteViz initialData={initialData} windowSize={SESSION_LENGTH} />
      <meta http-equiv="refresh" content="1;URL=/noteViz?iframe" />
    </>
  );
}

export function NoteVizIframe() {
  return (
    <iframe
      src="/noteViz?iframe"
      style={{ width: "100%", height: 160, border: 0 }}
      title="😂"
    ></iframe>
  );
}
