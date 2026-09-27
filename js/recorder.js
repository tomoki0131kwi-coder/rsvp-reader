// Record the microphone so learners can listen to themselves (stays on the device).
export const recordingSupported = !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

/** Start recording; resolves to {stop(): Promise<objectURL>}. */
export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  recorder.start();
  return {
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          resolve(URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })));
        };
        recorder.stop();
      }),
  };
}
