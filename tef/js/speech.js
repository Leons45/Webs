// Speech. Output uses the browser's French voices, so listening practice works
// with no audio files and no network. Input uses the Web Speech API where the
// browser provides it, for the dictée-à-l'oral and pronunciation checks.

let voices = [];
let ready = false;

export function loadVoices() {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve([]);
    const read = () => {
      voices = speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang));
      if (voices.length) { ready = true; resolve(voices); return true; }
      return false;
    };
    if (read()) return;
    speechSynthesis.addEventListener('voiceschanged', () => { read(); resolve(voices); }, { once: true });
    setTimeout(() => resolve(voices), 1200);
  });
}

export const frenchVoices = () => voices;
export const hasVoice = () => ready && voices.length > 0;

function voiceFor(name) {
  if (name) {
    const v = voices.find(v => v.name === name);
    if (v) return v;
  }
  // Prefer Canadian French when it exists — the exam is TEF Canada.
  return voices.find(v => /fr[-_]CA/i.test(v.lang))
      || voices.find(v => /fr[-_]FR/i.test(v.lang))
      || voices[0];
}

export function cancel() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

/** Speak one utterance. Resolves when it finishes or is cancelled. */
export function say(text, { rate = 0.95, pitch = 1, voiceName = '' } = {}) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve(false);
    const u = new SpeechSynthesisUtterance(text);
    const v = voiceFor(voiceName);
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'fr-CA'; }
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    speechSynthesis.speak(u);
  });
}

/**
 * Read a dialogue line by line. Speaker 'B' gets a slightly different pitch
 * so two voices stay distinguishable by ear even with one installed voice.
 * onLine(index) fires as each line starts.
 */
export async function sayLines(lines, { rate = 0.95, voiceName = '', onLine, gap = 320 } = {}) {
  for (let i = 0; i < lines.length; i++) {
    if (cancelled) break;
    onLine && onLine(i);
    const l = lines[i];
    await say(l.text, { rate, voiceName, pitch: l.who === 'B' ? 1.14 : 0.94 });
    if (cancelled) break;
    await new Promise(r => setTimeout(r, gap));
  }
  onLine && onLine(-1);
}

let cancelled = false;
export function stopAll() {
  cancelled = true;
  cancel();
  setTimeout(() => { cancelled = false; }, 60);
}
export const resetCancel = () => { cancelled = false; };

/* ── recognition (optional, Chrome / Edge / Safari) ───────────────── */

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const hasRecognition = () => !!SR;

export function listen({ onPartial, onFinal, onEnd, lang = 'fr-CA' } = {}) {
  if (!SR) return null;
  const r = new SR();
  r.lang = lang;
  r.continuous = true;
  r.interimResults = true;
  let full = '';
  r.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) full += t + ' '; else interim += t;
    }
    onPartial && onPartial(full + interim);
  };
  r.onend = () => { onFinal && onFinal(full.trim()); onEnd && onEnd(); };
  r.onerror = () => { onEnd && onEnd(); };
  try { r.start(); } catch { return null; }
  return r;
}

/* ── recording (for expression orale playback) ────────────────────── */

export async function recorder() {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('no-media');
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const chunks = [];
  const mime = ['audio/webm', 'audio/mp4', ''].find(m => !m || MediaRecorder.isTypeSupported(m));
  const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

  return {
    // Exposed so the UI can draw a live waveform off the same stream.
    stream,
    start: () => mr.start(250),
    stop: () => new Promise((resolve) => {
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        resolve(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })));
      };
      mr.stop();
    }),
    state: () => mr.state,
  };
}
