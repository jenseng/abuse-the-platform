import { Mp3Encoder } from "lamejs";

export async function audioBufferToMp3(audioBuffer: AudioBuffer) {
  // https://stackoverflow.com/questions/25839216/convert-float32array-to-int16array/29342909#29342909
  function convert(n: number) {
    const v = n < 0 ? n * 32768 : n * 32767; // convert in range [-32768, 32767]
    return Math.max(-32768, Math.min(32768, v)); // clamp
  }
  const samples = new Int16Array(audioBuffer.getChannelData(0).map(convert));

  const chunks = [];
  const mp3enc = new Mp3Encoder(1, audioBuffer.sampleRate, 128);
  const samplesPerFrame = 1152;
  for (let i = 0; i <= samples.length; i += samplesPerFrame) {
    chunks.push(
      await Promise.resolve(
        mp3enc.encodeBuffer(samples.subarray(i, i + samplesPerFrame))
      )
    );
  }
  chunks.push(mp3enc.flush());
  return new Blob(chunks, { type: "audio/mp3" });
}
