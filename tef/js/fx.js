// The feedback layer: the things that make a three-hour session feel like
// something is happening. Every effect is cheap, cancellable, and respects
// prefers-reduced-motion.

import * as store from './store.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const INKS = ['#FFC400', '#FF3D8B', '#FF6B2C', '#0A6CF0', '#00A95C', '#7B5BD6'];

/* ── the rubber stamp ──────────────────────────────────────────── */

export function stamp(text = 'Fait') {
  if (reduced()) return;
  const el = document.createElement('div');
  el.className = 'stamp';
  el.innerHTML = `<div class="stamp__mark">${text}</div>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

/* ── confetti ──────────────────────────────────────────────────── */

export function confetti(count = 40) {
  if (reduced()) return;
  const wrap = document.createElement('div');
  wrap.className = 'confetti';
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = -20 - Math.random() * 120 + 'px';
    p.style.background = INKS[Math.floor(Math.random() * INKS.length)];
    p.style.setProperty('--dur', (1.3 + Math.random() * 1.1).toFixed(2) + 's');
    p.style.setProperty('--spin', Math.round(360 + Math.random() * 720) + 'deg');
    p.style.animationDelay = (Math.random() * 0.35).toFixed(2) + 's';
    if (Math.random() > 0.5) p.style.borderRadius = '50%';
    frag.appendChild(p);
  }
  wrap.appendChild(frag);
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 3200);
}

/* ── sound ─────────────────────────────────────────────────────── */
// Synthesised, so there are no audio files to ship and nothing to load.

let ctx = null;
const audio = () => {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function blip(freqs, { type = 'sine', gain = 0.07, step = 0.075, len = 0.16 } = {}) {
  if (!store.settings().sound) return;
  const c = audio();
  if (!c) return;
  freqs.forEach((f, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = f;
    const t0 = c.currentTime + i * step;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + len + 0.02);
  });
}

export const sndRight = () => blip([659.25, 987.77]);                      // E5 → B5
export const sndWrong = () => blip([207.65, 164.81], { type: 'triangle', gain: 0.06, step: 0.09, len: 0.2 });
export const sndDone  = () => blip([523.25, 659.25, 783.99, 1046.5], { step: 0.085, gain: 0.065 });
export const sndTick  = () => blip([880], { gain: 0.035, len: 0.07 });
export const sndStart = () => blip([392, 523.25], { gain: 0.05, step: 0.06, len: 0.12 });

/* ── animated counters ─────────────────────────────────────────── */

export function countUp(el, to, { ms = 700, suffix = '' } = {}) {
  if (!el) return;
  const target = Number(to) || 0;
  if (reduced() || target === 0) { el.textContent = target + suffix; return; }
  const t0 = performance.now();
  const from = Number(el.dataset.from || 0);
  function frame(now) {
    const k = Math.min(1, (now - t0) / ms);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (target - from) * eased) + suffix;
    if (k < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/** Run countUp on every [data-count] inside root. */
export function countAll(root) {
  root.querySelectorAll('[data-count]').forEach(el => {
    countUp(el, el.dataset.count, { suffix: el.dataset.suffix || '' });
  });
}

/* ── live microphone waveform ──────────────────────────────────── */
/**
 * Draws the incoming signal onto a canvas. This is the one visual that
 * proves the microphone is alive, and it makes speaking practice feel like
 * an instrument rather than a form.
 */
export function waveform(canvas, stream) {
  if (!canvas || !stream) return () => {};
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return () => {};

  const c = new AC();
  const src = c.createMediaStreamSource(stream);
  const analyser = c.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.75;
  src.connect(analyser);

  const bins = new Uint8Array(analyser.frequencyBinCount);
  const g = canvas.getContext('2d');
  let raf = null, dead = false;

  const css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent').trim() || '#FF3D8B';
  const ink = css.getPropertyValue('--ink').trim() || '#16121F';

  function size() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();

  const BARS = 44;
  function draw() {
    if (dead) return;
    raf = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(bins);

    const w = canvas.width / (Math.min(2, devicePixelRatio || 1));
    const h = canvas.height / (Math.min(2, devicePixelRatio || 1));
    g.clearRect(0, 0, w, h);

    const slot = w / BARS;
    const bw = Math.max(2, slot * 0.55);
    const step = Math.floor(bins.length / BARS);

    for (let i = 0; i < BARS; i++) {
      let sum = 0;
      for (let k = 0; k < step; k++) sum += bins[i * step + k];
      const v = (sum / step) / 255;
      const bh = Math.max(3, v * (h - 8));
      const x = i * slot + (slot - bw) / 2;
      const y = (h - bh) / 2;
      g.fillStyle = accent;
      g.strokeStyle = ink;
      g.lineWidth = 1;
      if (g.roundRect) {
        g.beginPath();
        g.roundRect(x, y, bw, bh, Math.min(bw / 2, 3));
        g.fill();
        g.stroke();
      } else {
        g.fillRect(x, y, bw, bh);
        g.strokeRect(x, y, bw, bh);
      }
    }
  }
  draw();

  const onResize = () => size();
  addEventListener('resize', onResize);

  return () => {
    dead = true;
    if (raf) cancelAnimationFrame(raf);
    removeEventListener('resize', onResize);
    try { src.disconnect(); analyser.disconnect(); } catch {}
    try { c.close(); } catch {}
  };
}

/* ── celebration, composed ─────────────────────────────────────── */

export function celebrate(text = 'Fait') {
  stamp(text);
  confetti();
  sndDone();
}
