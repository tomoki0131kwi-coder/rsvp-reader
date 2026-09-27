// Text-to-speech with a native English voice.
// Android loads its voice list asynchronously; speaking before it arrives (or with only `lang`
// set) falls back to the system default voice, which on a Japanese phone reads English as katakana.

const supported = 'speechSynthesis' in window;
let voicesPromise = null;

const normLang = (l) => (l || '').replace('_', '-').toLowerCase(); // Android may report "en_US"

function rank(v) {
  const lang = normLang(v.lang);
  const region = lang === 'en-us' ? 0 : lang === 'en-gb' ? 1 : 2;
  const quality = /google|natural|enhanced|premium|neural/i.test(v.name) ? 0 : 1;
  return region * 10 + quality;
}

/** English voices available on this device, best first. Waits for the voice list to load. */
export function englishVoices() {
  if (!supported) return Promise.resolve([]);
  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      const pick = () =>
        speechSynthesis
          .getVoices()
          .filter((v) => normLang(v.lang).startsWith('en'))
          .sort((a, b) => rank(a) - rank(b));
      const now = pick();
      if (now.length) return resolve(now);
      let timer;
      const done = () => {
        clearTimeout(timer);
        speechSynthesis.removeEventListener('voiceschanged', done);
        resolve(pick());
      };
      speechSynthesis.addEventListener('voiceschanged', done);
      timer = setTimeout(done, 3000);
    }).then((list) => {
      if (!list.length) voicesPromise = null; // try again next time (voices may still be installing)
      return list;
    });
  }
  return voicesPromise;
}

/**
 * Speak English text. Returns 'ok', 'unsupported', or 'no-voice' (no English voice installed —
 * we don't speak then, rather than let a Japanese voice read it).
 */
export async function speak(text, voiceURI = '') {
  const u = await utterance(text, voiceURI);
  if (typeof u === 'string') return u;
  speechSynthesis.cancel();
  u.rate = 0.9;
  speechSynthesis.speak(u);
  return 'ok';
}

/** An utterance set up with an English voice, or 'unsupported' / 'no-voice'. */
export async function utterance(text, voiceURI = '') {
  if (!supported) return 'unsupported';
  const voices = await englishVoices();
  const voice = voices.find((v) => v.voiceURI === voiceURI) || voices[0];
  if (!voice) return 'no-voice';
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang.replace('_', '-'); // set both: some Android versions pick the engine by lang only
  return u;
}

export const NO_VOICE_HELP =
  '英語の音声が端末に見つかりません。Androidの設定で「テキスト読み上げ」を開き、Googleの音声サービスに英語（米国）の音声データを追加してください。';
