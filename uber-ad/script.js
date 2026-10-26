/* =========================================================================
   "Your day, your way." — 30s Uber concept film
   One continuous GSAP master timeline. Scenes don't hard-cut: a skewed
   gradient wipe sweeps across the frame at every transition (covers →
   content swaps underneath → reveals), and every element enters with a
   blur+scale+translate combo instead of a flat fade, so motion reads as
   one connected sequence rather than independent slides.
   ========================================================================= */

gsap.registerPlugin(MotionPathPlugin, CustomEase);

CustomEase.create('filmic', 'M0,0 C0.16,1 0.3,1 1,1');

const ACCENT_PALETTE = ['#3AA76D', '#ffffff', '#276EF1', '#9fe6c0'];

/* ---------------------------------------------------------------------
   Shared helpers
   --------------------------------------------------------------------- */

// cinematic entrance: blur-out -> sharp, slight rise, slight scale settle
function enter(targets, opts = {}) {
  return gsap.fromTo(targets,
    { opacity: 0, y: opts.y ?? 22, scale: opts.scale ?? 0.96, filter: 'blur(14px)' },
    { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: opts.duration ?? 0.7,
      ease: opts.ease ?? 'filmic', stagger: opts.stagger ?? 0 }
  );
}

// the connective tissue: a skewed gradient bar sweeps in from the left,
// reaches full coverage exactly at t (that's when the scene swap is
// invisible underneath it), then sweeps out to the right
function wipe(master, t, outId, inId) {
  const coverDur = 0.34, revealDur = 0.38;
  master.to('#wiper', { xPercent: 0, duration: coverDur, ease: 'power4.in' }, t - coverDur);
  master.to('#stage', { filter: 'brightness(1.35)', duration: 0.09, yoyo: true, repeat: 1 }, t - 0.09);
  master.set(`#${outId}`, { opacity: 0, visibility: 'hidden' }, t);
  master.set(`#${inId}`, { opacity: 1, visibility: 'visible' }, t);
  master.to('#wiper', { xPercent: 150, duration: revealDur, ease: 'power4.out' }, t);
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
   Background ambience — runs independently of the master timeline so
   the frame never looks static, even if the main timeline pauses
   --------------------------------------------------------------------- */
function startAmbience() {
  gsap.to('#bg-glow', {
    backgroundPosition: '40px -30px, -30px 40px, 0 0',
    duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
}

/* ---------------------------------------------------------------------
   Master timeline
   --------------------------------------------------------------------- */
function buildTimeline() {
  const confettiPieces = buildConfetti();

  gsap.set('#wiper', { xPercent: -150, skewX: -12 });

  const master = gsap.timeline({
    paused: true,
    defaults: { ease: 'filmic' },
    onComplete: () => document.getElementById('replay-btn').classList.add('visible'),
    onUpdate: () => {
      document.getElementById('progress-fill').style.width = (master.progress() * 100) + '%';
    }
  });

  /* ================= S0 — HOOK (0.0 - 3.2) ================= */
  master.set('#s0', { opacity: 1, visibility: 'visible' }, 0);
  master.fromTo('#clock-hr', { rotation: -20 }, { rotation: 40, duration: 2.6, ease: 'sine.inOut' }, 0.1);
  master.fromTo('#clock-min', { rotation: -60 }, { rotation: 220, duration: 2.6, ease: 'sine.inOut' }, 0.1);
  master.fromTo('#clock-arc', { strokeDashoffset: 276 }, { strokeDashoffset: 60, duration: 2.6, ease: 'filmic' }, 0.1);
  master.add(enter('#s0 .icon-clock', { y: 10 }), 0.05);
  master.add(enter('#e0', { y: 14 }), 0.25);
  master.add(enter('#h0', { y: 26, duration: 0.8 }), 0.45);

  /* ================= S1 — OPEN THE APP (3.2 - 7.0) ================= */
  wipe(master, 3.2, 's0', 's1');
  master.add(enter('.phone-card', { y: 34, scale: 0.9, duration: 0.65 }), 3.25);

  // typing effect: reveal "Home" character by character via width clip
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
  master.add(enter('#request-btn', { y: 12, scale: 0.9, duration: 0.4 }), 4.5);
  master.to('#request-btn', { scale: 0.94, duration: 0.09, yoyo: true, repeat: 1 }, 5.1); // tap press

  /* ================= S2 — MATCHED (7.0 - 11.4) ================= */
  wipe(master, 7.0, 's1', 's2');
  master.add(enter('.radar', { scale: 0.85, duration: 0.5 }), 7.05);
  master.add(enter('#match-label', { y: 10 }), 7.2);
  master.fromTo('#radar-sweep', { rotation: 0, opacity: 0.9 },
    { rotation: 720, duration: 1.7, ease: 'power2.inOut', transformOrigin: '110px 110px' }, 7.3);
  master.to('#found-car', { scale: 1, duration: 0.4, ease: 'back.out(4)' }, 8.9);
  master.to('.radar-ring', { stroke: 'rgba(58,167,109,0.6)', duration: 0.3, stagger: 0.06 }, 8.9);
  master.call(() => { document.getElementById('match-label').textContent = 'Driver matched!'; }, null, 8.95);
  master.add(enter('.driver-card', { y: 20, duration: 0.5 }), 9.2);

  /* ================= S3 — LIVE TRACKING (11.4 - 15.8) ================= */
  wipe(master, 11.4, 's2', 's3');
  master.to('#route-path', { strokeDashoffset: 0, duration: 1.1, ease: 'filmic' }, 11.5);
  master.to('#pin', { scale: 1, duration: 0.35, ease: 'back.out(5)' }, 11.6);
  master.to('#eta-car', { scale: 1, duration: 0.3, ease: 'back.out(4)' }, 12.5);
  master.to('#eta-car', {
    motionPath: { path: '#route-path', align: '#route-path', alignOrigin: [0.5, 0.5], start: 1, end: 0 },
    duration: 2.1, ease: 'power1.inOut'
  }, 12.7);
  master.add(enter('#s3 .eyebrow, .eta-number', { y: 14, stagger: 0.08 }), 11.7);
  master.to('#eta-count', {
    textContent: 1, duration: 2.1, snap: { textContent: 1 }, ease: 'power1.inOut'
  }, 12.7);

  /* ================= S4 — THE RIDE (15.8 - 21.0) ================= */
  wipe(master, 15.8, 's3', 's4');
  master.add(enter('.city-wrap', { scale: 0.92, duration: 0.6 }), 15.85);
  master.fromTo('#far-buildings', { x: 0 }, { x: -240, duration: 5.1, ease: 'none' }, 16.0);
  master.fromTo('#near-buildings', { x: 0 }, { x: -400, duration: 5.1, ease: 'none' }, 16.0);
  master.to('.icon-car-ride', { y: -3, duration: 0.22, yoyo: true, repeat: 22, ease: 'sine.inOut' }, 16.0);
  master.add(enter('.line-caption', { y: 18 }), 17.6);

  /* ================= S5 — ARRIVAL (21.0 - 25.4) ================= */
  wipe(master, 21.0, 's4', 's5');
  master.add(enter('.icon-check', { scale: 0.7, duration: 0.5 }), 21.05);
  master.to('#check-ring', { strokeDashoffset: 0, duration: 0.55, ease: 'filmic' }, 21.15);
  master.to('#check-path', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 21.55);
  master.add(enter('#s5 .eyebrow', { y: 12 }), 21.7);
  master.add(enter('.receipt', { y: 20, duration: 0.5 }), 22.0);

  /* ================= S6 — BRAND CLOSE (25.4 - 30.0) ================= */
  wipe(master, 25.4, 's5', 's6');
  master.add(enter('.closer-line', { y: 30, scale: 0.94, duration: 0.8 }), 25.45);
  master.to('.cta-wordmark', { opacity: 1, duration: 0.3 }, 26.3);
  master.to('.cta-btn', { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(4)' }, 26.45);
  master.to('.cta-btn', {
    boxShadow: '0 0 0 18px rgba(58,167,109,0)',
    duration: 1.1, repeat: -1, ease: 'power1.out'
  }, 26.9);

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
      26.35 + Math.random() * 0.25
    );
  });

  master.to('#stage', { duration: 1.3 }, 28.7); // hold on end frame

  return master;
}

startAmbience();
const tl = buildTimeline();
tl.play();

document.getElementById('replay-btn').addEventListener('click', () => {
  document.getElementById('replay-btn').classList.remove('visible');
  tl.restart();
});
