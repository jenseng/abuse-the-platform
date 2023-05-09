import { useIsHydrated } from "~/hooks/useIsHydrated";
import { defaultSynth } from "~/utils/instruments.client";

export function VolumeSlider() {
  const isHydrated = useIsHydrated();

  if (!isHydrated) return null;

  const min = -20;
  const max = 0; // i.e. the current system volume

  return (
    <input
      style={{ float: "right" }}
      type="range"
      defaultValue={defaultSynth.volume.value}
      min={min}
      max={max}
      onChange={(e) => (defaultSynth.volume.value = e.target.valueAsNumber)}
    />
  );
}
