import type { ActionFunctionArgs } from "react-router";
import { reRecordAllNotes } from "~/utils/notes.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "rerecord") {
    reRecordAllNotes();
    return null;
  }
}
