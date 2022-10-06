import * as Tone from "tone";

Tone.setContext(new Tone.Context({ lookAhead: 0 }));

export function getSynth() {
  return new Tone.Synth().toDestination();
}
