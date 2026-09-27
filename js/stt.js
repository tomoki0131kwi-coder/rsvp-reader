// Speech-to-text with the browser's speech recognition.
// On Android Chrome this is Google's recognition service: the audio leaves the device.
const getRecognition = () => window.SpeechRecognition || window.webkitSpeechRecognition;

export const sttSupported = !!getRecognition();
export const STT_NOTE = '話した音声は、文字起こしのためGoogleの音声認識サービスに送られます。イヤホンを使うと、お手本の音声を拾わず正確に認識できます。';

/**
 * Listen to English speech.
 * opts: {continuous, onText(finalText, interimText), onEnd(finalText), onError(code)}
 * Returns {stop()}. In continuous mode recognition restarts itself after pauses until stop() is called.
 */
export function listen(opts) {
  const Recognition = getRecognition();
  if (!Recognition) {
    opts.onError?.('unsupported');
    return { stop() {} };
  }
  let finalText = '';
  let stopped = false;
  let finished = false;
  let rec = null;
  const finish = () => {
    if (finished) return;
    finished = true;
    opts.onEnd?.(finalText);
  };
  const start = () => {
    rec = new Recognition();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = !!opts.continuous;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += (finalText ? ' ' : '') + r[0].transcript.trim();
        else interim += r[0].transcript;
      }
      opts.onText?.(finalText, interim);
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      stopped = true;
      opts.onError?.(e.error);
    };
    rec.onend = () => {
      if (!stopped && opts.continuous) {
        try {
          start();
        } catch {
          finish();
        }
      } else finish();
    };
    rec.start();
  };
  try {
    start();
  } catch {
    opts.onError?.('start-failed');
    finish();
  }
  return {
    stop() {
      stopped = true;
      try {
        rec.stop();
      } catch {
        finish();
      }
    },
  };
}

export function sttErrorText(code) {
  return (
    {
      unsupported: 'この端末・ブラウザは音声認識に対応していません（Android の Chrome をお使いください）',
      'not-allowed': 'マイクの使用が許可されていません。ブラウザの設定でマイクを許可してください',
      'audio-capture': 'マイクが見つかりません',
      network: '音声認識にはインターネット接続が必要です',
    }[code] || `音声認識でエラーが起きました（${code}）`
  );
}
