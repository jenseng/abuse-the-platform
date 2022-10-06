import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { getNotesDirectory } from "~/utils/notes.server";

export async function action({ request, params: { note } }: ActionArgs) {
  if (!note?.match(/^[a-g]#?\d$/))
    return json({ error: "invalid note" }, { status: 422 });

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: () => note,
      directory: getNotesDirectory(),
      filter: ({ name }) => name === "note",
    }),
    unstable_createMemoryUploadHandler()
  );

  await unstable_parseMultipartFormData(request, uploadHandler);
  return null;
}
