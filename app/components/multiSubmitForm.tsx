import type { FormProps, SubmitFunction } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import type { FormEvent } from "react";
import { useCallback, useRef } from "react";

/**
 * Form that automatically coalesces any submits that happen in rapid succession
 * This is how we can post a chord 😅
 *
 *  * Callouts:
 *  - Form/useSubmit
 */
export function MultiSubmitForm({
  coalesceWindow = 50,
  submit,
  ...formProps
}: FormProps & { coalesceWindow?: number; submit?: SubmitFunction }) {
  const pendingFormData = useRef(new FormData());
  const doSubmitTimer = useRef<number | undefined>();
  const defaultSubmit = useSubmit();
  const doSubmit = submit ?? defaultSubmit;

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
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
          doSubmit(pendingFormData.current, {
            action: formProps.action,
            method: formProps.method,
          });
        }, coalesceWindow) as unknown as number;
      }
    },
    [coalesceWindow, doSubmit, formProps.action, formProps.method]
  );

  // trigger a submit as soon as we touch, so we can support chords
  const onTouchStart = useCallback((event: React.TouchEvent) => {
    if (isSubmitButton(event.target)) {
      event.target.form?.requestSubmit(event.target);
    }
  }, []);

  return (
    <Form onSubmit={onSubmit} onTouchStart={onTouchStart} {...formProps} />
  );
}

function isSubmitButton(e: unknown): e is HTMLInputElement | HTMLButtonElement {
  if (!(e instanceof HTMLInputElement) && !(e instanceof HTMLButtonElement))
    return false;
  return e.type === "submit" || e.type === "image";
}
