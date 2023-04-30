import * as Tone from "tone";

Tone.setContext(new Tone.Context({ lookAhead: 0.1 }));

export function getSynth() {
  return new Tone.PolySynth().toDestination();
}

const defaultSynth = getSynth();
export function play(note: string, synth = defaultSynth) {
  synth.triggerAttackRelease(note, "8n");
}
