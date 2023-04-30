import { Form, Link, useSearchParams, useSubmit } from "@remix-run/react";
import type { FormEvent, PropsWithChildren } from "react";
import { useRef } from "react";
import { Piano } from "~/components/piano";
import { Playback } from "../notes/$note";

/*
 * Callouts:
 *  - Form/useSubmit
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

      <h2>Progressive Piano</h2>

      <p>
        Play by yourself, with or without JavaScript. "Record" a song with your
        browser history.
      </p>

      <MultiSubmitForm window={50}>
        <Piano activeNotes={playNotes} buster={buster} />
        <input type="hidden" value={Math.random()} name="buster" />
      </MultiSubmitForm>
      <Playback notes={playNotes} buster={buster} />
    </>
  );
}

/**
 * Coalesces multiple submits that happen within a small window. This is how we can play a chord 🙃
 */
function MultiSubmitForm({
  window,
  children,
}: PropsWithChildren<{ window: number }>) {
  const pendingFormData = useRef(new FormData());
  const doSubmitTimer = useRef<number | undefined>();
  const doSubmit = useSubmit();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFormData = new FormData(
      event.target as HTMLFormElement,
      (event.nativeEvent as SubmitEvent).submitter // 🥳 https://github.com/whatwg/xhr/pull/366
    );
    // add in anything that comes along if we haven't submitted yet
    if (doSubmitTimer.current) {
      for (const [key, value] of nextFormData.entries()) {
        pendingFormData.current.append(key, value);
      }
    } else {
      pendingFormData.current = nextFormData;
      doSubmitTimer.current = setTimeout(() => {
        doSubmitTimer.current = undefined;
        doSubmit(pendingFormData.current, {});
      }, window) as unknown as number;
    }
  };
  return <Form onSubmit={onSubmit}>{children}</Form>;
}
