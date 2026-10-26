/* =========================================================================
   "Your day, your way." — 30s Uber concept film
   v3: built on real professional flat-illustration artwork (unDraw,
   MIT-licensed) instead of hand-drawn placeholder shapes, laid out as
   proper split compositions (illustration + text, alternating sides)
   instead of everything dead-center. One continuous GSAP timeline,
   iris-wipe transitions between scenes, illustrations enter with a
   slide+blur+scale combo and idle-float continuously once in frame.
   ========================================================================= */

gsap.registerPlugin(CustomEase);
CustomEase.create('filmic', 'M0,0 C0.16,1 0.3,1 1,1');

const ACCENT_PALETTE = ['#276EF1', '#ED6E33', '#ffffff', '#9fbdf5'];

function buildConfetti() {
  const wrap = document.getElementById('confetti');
  const pieces = [];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.style.background = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
    wrap.appendChild(s);
    pieces.push(s);
  }
  return pieces;
}

// cinematic entrance for illustrations: slide in from a side + blur-sharpen
function enterArt(target, fromX, opts = {}) {
  return gsap.fromTo(target,
    { opacity: 0, x: fromX, scale: opts.scale ?? 0.92, filter: 'blur(10px)' },
    { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: opts.duration ?? 0.9, ease: 'filmic' }
  );
}
function enterText(targets, opts = {}) {
  return gsap.fromTo(targets,
    { opacity: 0, y: opts.y ?? 22, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: opts.duration ?? 0.6,
      ease: 'filmic', stagger: opts.stagger ?? 0.1 }
  );
}

// continuous idle float so illustrations never sit dead-still once in frame
function idleFloat(target, amp = 10, dur = 3.2) {
  gsap.to(target, { y: `+=${amp}`, duration: dur, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}

function iris(master, t, outId, inId) {
  const coverDur = 0.4, revealDur = 0.44;
  master.to('#iris', { scale: 1, duration: coverDur, ease: 'power3.in' }, t - coverDur);
  master.set(`#${outId}`, { opacity: 0, visibility: 'hidden' }, t);
  master.set(`#${inId}`, { opacity: 1, visibility: 'visible' }, t);
  master.to('#iris', { scale: 0, duration: revealDur, ease: 'power3.out' }, t);
}

function buildTimeline() {
  const confettiPieces = buildConfetti();
  gsap.set('#iris', { scale: 0 });

  // start idle floats now — they run independently of the master timeline
  // so artwork is always gently alive, even while its scene is hidden
  idleFloat('.art-hook', 9, 3.4);
  idleFloat('.art-request', 8, 3.0);
  idleFloat('.art-matched', 10, 3.6);
  idleFloat('.art-ride', 6, 2.6);
  idleFloat('.art-review', 8, 3.2);
  idleFloat('.art-celebrate', 12, 2.2);

  const master = gsap.timeline({
    paused: true,
    defaults: { ease: 'filmic' },
    onComplete: () => document.getElementById('replay-btn').classList.add('visible'),
    onUpdate: () => {
      document.getElementById('progress-fill').style.width = (master.progress() * 100) + '%';
    }
  });

  /* ================= S0 — HOOK (0 - 3.4) ================= */
  master.set('#s0', { opacity: 1, visibility: 'visible' }, 0);
  master.add(enterArt('.art-hook', -60), 0.05);
  master.add(enterText('#s0 .eyebrow-dark, #s0 .headline, #s0 .sub'), 0.3);

  /* ================= S1 — REQUEST (3.4 - 7.4) ================= */
  iris(master, 3.4, 's0', 's1');
  master.add(enterArt('.art-request', 60), 3.45);
  master.add(enterText('#s1 .eyebrow-dark, #s1 .headline'), 3.7);
  master.add(enterText('.pill-input', { y: 14 }), 4.2);

  const destText = 'Home';
  master.call(() => { document.getElementById('type-text').textContent = ''; }, null, 4.6);
  master.to({}, {
    duration: 0.7,
    onUpdate: function () {
      const n = Math.ceil(this.progress() * destText.length);
      document.getElementById('type-text').textContent = destText.slice(0, n);
    }
  }, 4.75);
  master.to('.caret', { opacity: 0, duration: 0.15, repeat: 6, yoyo: true }, 4.75);

  /* ================= S2 — MATCHED (7.4 - 11.4) ================= */
  iris(master, 7.4, 's1', 's2');
  master.add(enterArt('.art-matched', -60), 7.45);
  master.add(enterText('#s2 .eyebrow-dark'), 7.7);
  master.fromTo('#match-headline', { opacity: 0, y: 18, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, 7.85);
  master.call(() => { document.getElementById('match-headline').textContent = 'Driver matched!'; }, null, 9.0);
  master.add(enterText('#driver-chip', { y: 14 }), 9.2);

  /* ================= S3 — THE RIDE (11.4 - 18.0) ================= */
  iris(master, 11.4, 's2', 's3');
  master.add(enterArt('.art-ride', 70, { duration: 1.0 }), 11.45);
  master.add(enterText('#s3 .eyebrow-dark, #s3 .headline'), 11.8);
  master.add(enterText('.eta-number'), 12.1);
  master.to('#eta-count', { textContent: 0, duration: 5.2, snap: { textContent: 1 }, ease: 'power1.in' }, 12.3);

  /* ================= S4 — ARRIVAL + RATING (18.0 - 23.4) ================= */
  iris(master, 18.0, 's3', 's4');
  master.add(enterArt('.art-review', -60), 18.05);
  master.add(enterText('#s4 .eyebrow-dark, #s4 .headline'), 18.3);
  master.add(enterText('.receipt', { y: 18 }), 18.8);

  /* ================= S5 — BRAND CLOSE (23.4 - 30.0) ================= */
  iris(master, 23.4, 's4', 's5');
  master.fromTo('.art-celebrate', { opacity: 0, scale: 0.5, rotation: -8 },
    { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.5)' }, 23.45);
  master.add(enterText('.closer-line', { y: 26 }), 23.75);
  master.to('.cta-wordmark', { opacity: 1, duration: 0.3 }, 24.6);
  master.to('.cta-btn', { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(4)' }, 24.75);
  master.to('.cta-btn', {
    boxShadow: '0 0 0 18px rgba(39,110,241,0)',
    duration: 1.1, repeat: -1, ease: 'power1.out'
  }, 25.2);

  confettiPieces.forEach((p, i) => {
    const angle = (i / confettiPieces.length) * Math.PI * 2;
    const dist = 170 + Math.random() * 200;
    master.fromTo(p,
      { x: 0, y: 0, opacity: 1, rotation: 0 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 1.5 + Math.random() * 0.6,
        ease: 'power2.out'
      },
      23.6 + Math.random() * 0.3
    );
  });

  master.to('#stage', { duration: 1.2 }, 28.8);

  return master;
}

const tl = buildTimeline();
tl.play();

document.getElementById('replay-btn').addEventListener('click', () => {
  document.getElementById('replay-btn').classList.remove('visible');
  tl.restart();
});
