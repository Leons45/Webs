/* =========================================================================
   "Your day, your way." — 30s Uber concept film
   Flat-vector illustration style (character silhouette, hanging icon
   badges, top-down map/car, organic blob backgrounds) instead of app-UI
   cards — matched to a flat motion-design reference rather than a
   screen-recording aesthetic. One continuous GSAP timeline; scenes are
   connected with a full-frame iris wipe instead of hard cuts, and an
   ambient blob background breathes behind every scene independently of
   the main timeline so nothing ever looks static.
   ========================================================================= */

gsap.registerPlugin(MotionPathPlugin, CustomEase, MorphSVGPlugin, DrawSVGPlugin);
CustomEase.create('filmic', 'M0,0 C0.16,1 0.3,1 1,1');

const ACCENT_PALETTE = ['#276EF1', '#ED6E33', '#ffffff', '#9fbdf5'];

/* ---------------------------------------------------------------------
   Ambient blob backgrounds — true shape morphing (MorphSVGPlugin) between
   two hand-authored organic variants per scene, looped yoyo so the
   background keeps breathing independently of the main timeline. This
   replaces per-frame path recomputation with a proper GPU-friendly morph.
   --------------------------------------------------------------------- */
function blobPath(cx, cy, r, points, wobble, phase) {
  const pts = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const rad = r + Math.sin(angle * 3 + phase) * wobble + Math.cos(angle * 2 - phase * 0.7) * wobble * 0.6;
    pts.push([cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]} `;
  for (let i = 0; i < points; i++) {
    const p0 = pts[i];
    const p1 = pts[(i + 1) % points];
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;
    d += `Q ${p0[0]} ${p0[1]} ${mx} ${my} `;
  }
  d += 'Z';
  return d;
}

function startAmbientBlobs() {
  const configs = [
    { id: 'wave-path-0', cx: 18, cy: 18, r: 30, wobble: 7 },
    { id: 'wave-path-1', cx: 82, cy: 78, r: 34, wobble: 8 },
    { id: 'wave-path-2', cx: 50, cy: 85, r: 40, wobble: 9 },
    { id: 'wave-path-3', cx: 85, cy: 15, r: 28, wobble: 7 },
    { id: 'wave-path-4', cx: 50, cy: 90, r: 42, wobble: 10 },
    { id: 'wave-path-5', cx: 20, cy: 80, r: 38, wobble: 9 }
  ];
  configs.forEach((cfg, i) => {
    const el = document.getElementById(cfg.id);
    if (!el) return;
    const shapeA = blobPath(cfg.cx, cfg.cy, cfg.r, 8, cfg.wobble, 0);
    const shapeB = blobPath(cfg.cx, cfg.cy, cfg.r, 8, cfg.wobble, Math.PI * 1.15);
    const shapeC = blobPath(cfg.cx, cfg.cy, cfg.r, 8, cfg.wobble, Math.PI * 2.1);
    el.setAttribute('d', shapeA);
    const tl = gsap.timeline({ repeat: -1, delay: i * 0.6 });
    tl.to(el, { duration: 9, ease: 'sine.inOut', morphSVG: { shape: shapeB, type: 'rotational' } })
      .to(el, { duration: 9, ease: 'sine.inOut', morphSVG: { shape: shapeC, type: 'rotational' } })
      .to(el, { duration: 9, ease: 'sine.inOut', morphSVG: { shape: shapeA, type: 'rotational' } });
  });
}

/* ---------------------------------------------------------------------
   Rive character — progressive enhancement. If /assets/character.riv
   exists, it replaces the flat SVG fallback with a real rigged, bone-
   animated character and plays its "idle" state machine in sync with
   the hook scene. Silently no-ops (keeping the SVG fallback) if the
   file isn't there yet or the runtime fails — see build notes below.
   --------------------------------------------------------------------- */
function tryLoadRiveCharacter() {
  const canvas = document.getElementById('rive-char');
  const fallback = document.getElementById('svg-char-fallback');
  if (!canvas || typeof rive === 'undefined') return;

  fetch('assets/character.riv', { method: 'HEAD' })
    .then(res => {
      if (!res.ok) return;
      new rive.Rive({
        src: 'assets/character.riv',
        canvas,
        autoplay: true,
        stateMachines: 'State Machine 1',
        onLoad: () => {
          canvas.style.display = 'block';
          fallback.style.display = 'none';
        }
      });
    })
    .catch(() => { /* no .riv yet — flat SVG character stays visible */ });
}

/* ---------------------------------------------------------------------
   Shared helpers
   --------------------------------------------------------------------- */
function enter(targets, opts = {}) {
  return gsap.fromTo(targets,
    { opacity: 0, y: opts.y ?? 20, scale: opts.scale ?? 0.96, filter: 'blur(12px)' },
    { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: opts.duration ?? 0.65,
      ease: opts.ease ?? 'filmic', stagger: opts.stagger ?? 0 }
  );
}

// full-frame iris wipe: a circle grows from a point to cover the whole
// screen exactly at t (scene swap happens invisibly underneath), then
// shrinks back away revealing the next scene
function iris(master, t, outId, inId) {
  const coverDur = 0.42, revealDur = 0.46;
  master.to('#iris', { scale: 1, duration: coverDur, ease: 'power3.in' }, t - coverDur);
  master.set(`#${outId}`, { opacity: 0, visibility: 'hidden' }, t);
  master.set(`#${inId}`, { opacity: 1, visibility: 'visible' }, t);
  master.to('#iris', { scale: 0, duration: revealDur, ease: 'power3.out' }, t);
}

function buildConfetti() {
  const wrap = document.getElementById('confetti');
  const pieces = [];
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    s.style.background = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
    wrap.appendChild(s);
    pieces.push(s);
  }
  return pieces;
}

/* ---------------------------------------------------------------------
   Master timeline
   --------------------------------------------------------------------- */
function buildTimeline() {
  const confettiPieces = buildConfetti();

  // every scale-pop element is initialized entirely through GSAP (no
  // baked SVG transforms) so there's no ambiguity about transform origin
  gsap.set(['#badge-box', '#badge-icon', '#arrive-box', '#route-pin', '#car-track'],
    { transformBox: 'fill-box', transformOrigin: '50% 50%' });
  gsap.set('#badge-icon', { scale: 0 });
  gsap.set('#route-pin', { scale: 0 });
  gsap.set('#car-track', { scale: 0 });
  gsap.set('#car-match', { scale: 0, transformOrigin: '50% 50%' });
  gsap.set('#iris', { scale: 0 });
  gsap.set('#route-path', { drawSVG: '0%' });
  gsap.set('#arrive-check', { drawSVG: '0%' });

  // badge box starts as a small dot and morphs into the rounded-square
  // badge shape (true point-to-point MorphSVG, not a scale tween) —
  // same trick reused for the arrival badge
  const DOT_SHAPE = 'M43,80 A2,2 0 1 0 47,80 A2,2 0 1 0 43,80 Z';
  const BADGE_SHAPE = 'M25,42 L65,42 A18,18 0 0 1 83,60 L83,100 A18,18 0 0 1 65,118 L25,118 A18,18 0 0 1 7,100 L7,60 A18,18 0 0 1 25,42 Z';
  gsap.set('#badge-box', { morphSVG: DOT_SHAPE });
  gsap.set('#arrive-box', { morphSVG: DOT_SHAPE });

  const master = gsap.timeline({
    paused: true,
    defaults: { ease: 'filmic' },
    onComplete: () => document.getElementById('replay-btn').classList.add('visible'),
    onUpdate: () => {
      document.getElementById('progress-fill').style.width = (master.progress() * 100) + '%';
    }
  });

  /* ================= S0 — HOOK (0 - 3.0) ================= */
  master.set('#s0', { opacity: 1, visibility: 'visible' }, 0);
  master.add(enter('#s0 .char', { y: 24, scale: 0.9, duration: 0.7 }), 0.1);
  master.add(enter('#bubble-0', { y: 14, duration: 0.5 }), 0.55);
  master.fromTo('#hook-hr', { rotation: -10 }, { rotation: 35, duration: 1.8, ease: 'sine.inOut' }, 0.6);
  master.fromTo('#hook-min', { rotation: -40 }, { rotation: 160, duration: 1.8, ease: 'sine.inOut' }, 0.6);
  master.add(enter('#h0', { y: 26, duration: 0.7 }), 0.8);

  /* ================= S1 — REQUEST (3.0 - 6.6) ================= */
  iris(master, 3.0, 's0', 's1');
  master.add(enter('#card-1', { y: 30, scale: 0.9, duration: 0.6 }), 3.05);

  const destText = 'Home';
  master.call(() => { document.getElementById('type-text').textContent = ''; }, null, 3.5);
  master.to({}, {
    duration: 0.7,
    onUpdate: function () {
      const n = Math.ceil(this.progress() * destText.length);
      document.getElementById('type-text').textContent = destText.slice(0, n);
    }
  }, 3.65);
  master.to('.caret', { opacity: 0, duration: 0.15, repeat: 5, yoyo: true }, 3.65);
  master.add(enter('#request-btn', { y: 10, scale: 0.9, duration: 0.4 }), 4.5);
  master.to('#request-btn', { scale: 0.94, duration: 0.09, yoyo: true, repeat: 1 }, 5.3);

  /* ================= S2 — MATCHED (6.6 - 10.2) ================= */
  iris(master, 6.6, 's1', 's2');
  master.add(enter('#match-label', { y: 10 }), 6.7);
  master.to('#badge-box', { duration: 0.5, ease: 'back.out(2.2)', morphSVG: { shape: BADGE_SHAPE, type: 'rotational' } }, 7.0);
  master.to('#badge-icon', { scale: 1, duration: 0.45, ease: 'back.out(3.5)' }, 7.2);
  master.call(() => { document.getElementById('match-label').textContent = 'Driver matched — Marcus'; }, null, 7.4);
  master.to('#car-match', { scale: 1, duration: 0.4, ease: 'back.out(4)' }, 7.9);
  master.to('#car-match', { y: -4, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 8.4);

  /* ================= S3 — TRACK + RIDE (10.2 - 19.4) ================= */
  iris(master, 10.2, 's2', 's3');
  master.add(enter('.map', { scale: 0.92, duration: 0.6 }), 10.25);
  master.add(enter('#eta-chip, #track-caption', { y: 14, stagger: 0.08 }), 10.6);

  master.to('#route-path', { drawSVG: '100%', duration: 1.7, ease: 'filmic' }, 10.7);
  master.to('#route-pin', { scale: 1, duration: 0.35, ease: 'back.out(5)' }, 10.9);
  master.to('#car-track', { scale: 1, duration: 0.3, ease: 'back.out(4)' }, 11.3);
  master.fromTo('#map-grid', { x: 0, y: 0 }, { x: -40, y: 20, duration: 7.5, ease: 'sine.inOut' }, 11.6);
  master.to('#car-track', {
    motionPath: { path: '#route-path', align: '#route-path', alignOrigin: [0.5, 0.5], start: 1, end: 0 },
    duration: 6.8, ease: 'power1.inOut'
  }, 11.6);
  master.to('#eta-count', { textContent: 0, duration: 6.8, snap: { textContent: 1 }, ease: 'power1.in' }, 11.6);
  master.call(() => { document.getElementById('track-caption').textContent = 'Almost there.'; }, null, 16.5);

  /* ================= S4 — ARRIVAL (19.4 - 24.0) ================= */
  iris(master, 19.4, 's3', 's4');
  master.to('#arrive-box', { duration: 0.5, ease: 'back.out(2.2)', morphSVG: { shape: BADGE_SHAPE, type: 'rotational' } }, 19.45);
  master.to('#arrive-check', { drawSVG: '100%', duration: 0.4, ease: 'power2.out' }, 19.85);
  master.add(enter('#s4 .eyebrow-dark', { y: 12 }), 20.0);
  master.add(enter('.receipt', { y: 20, duration: 0.5 }), 20.3);

  /* ================= S5 — BRAND CLOSE (24.0 - 30.0) ================= */
  iris(master, 24.0, 's4', 's5');
  master.add(enter('.closer-line', { y: 30, scale: 0.94, duration: 0.8 }), 24.05);
  master.to('.cta-wordmark', { opacity: 1, duration: 0.3 }, 24.9);
  master.to('.cta-btn', { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(4)' }, 25.05);
  master.to('.cta-btn', {
    boxShadow: '0 0 0 18px rgba(39,110,241,0)',
    duration: 1.1, repeat: -1, ease: 'power1.out'
  }, 25.5);

  confettiPieces.forEach((p, i) => {
    const angle = (i / confettiPieces.length) * Math.PI * 2;
    const dist = 170 + Math.random() * 190;
    master.fromTo(p,
      { x: 0, y: 0, opacity: 1, rotation: 0 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 50,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 1.5 + Math.random() * 0.6,
        ease: 'power2.out'
      },
      24.95 + Math.random() * 0.25
    );
  });

  master.to('#stage', { duration: 1.2 }, 28.8);

  return master;
}

startAmbientBlobs();
tryLoadRiveCharacter();
const tl = buildTimeline();
tl.play();

document.getElementById('replay-btn').addEventListener('click', () => {
  document.getElementById('replay-btn').classList.remove('visible');
  tl.restart();
});
