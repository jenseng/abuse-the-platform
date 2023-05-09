export const hiddenTarget = "hiddenTarget";
export function HiddenTarget() {
  // form target for when we play a note w/o JS, so we don't refresh the page
  return (
    <iframe
      style={{ position: "absolute", visibility: "hidden" }}
      src="about:blank"
      name={hiddenTarget}
      title="🙈"
    ></iframe>
  );
}
