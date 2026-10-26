/* =========================================================
   30-second quick-cut concept ad.
   15 beats, ~1.4-4s each, hard cuts with a flash-frame between
   scenes instead of slow crossfades. Punchy/elastic easing
   throughout so nothing settles slowly.
   ========================================================= */

gsap.registerPlugin(MotionPathPlugin);

const CONFETTI_COLORS = ['#3AA76D', '#ffffff', '#276EF1', '#FFC043'];

function buildConfetti() {
  const wrap = document.getElementById('confetti');
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    wrap.appendChild(s);
  }
  return wrap.querySelectorAll('span');
}

/* quick hard-cut helper: flash white for a beat, swap scene visibility,
   and pop the new scene's content in with an elastic/back ease */
function cutTo(master, pos, outId, inId) {
  if (outId) {
    master.to('#flash', { opacity: 1, duration: 0.05 }, pos);
    master.set(`#${outId}`, { opacity: 0, visibility: 'hidden' }, pos + 0.03);
  }
  master.set(`#${inId}`, { opacity: 1, visibility: 'visible' }, pos + 0.05);
  master.to('#flash', { opacity: 0, duration: 0.08 }, pos + 0.08);
}

function buildTimeline() {
  const confettiPieces = buildConfetti();

  const master = gsap.timeline({
    paused: true,
    onComplete: () => document.getElementById('replay-btn').classList.add('visible'),
    onUpdate: () => {
      document.getElementById('progress-fill').style.width = (master.progress() * 100) + '%';
    }
  });

  /* ---------- S1 : Need a ride? (0.0 - 1.4) ---------- */
  master.set('#s1', { opacity: 1, visibility: 'visible' }, 0);
  master.fromTo('#clock-hr', { rotation: 0 }, { rotation: 360, duration: 1.1, ease: 'power1.inOut', repeat: 1 }, 0);
  master.fromTo('#clock-min', { rotation: 0 }, { rotation: 1080, duration: 1.1, ease: 'power1.inOut', repeat: 1 }, 0);
  master.fromTo('#t1', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(3)' }, 0.1);

  /* ---------- S2 : Uber brand smash (1.4 - 2.8) ---------- */
  cutTo(master, 1.4, 's1', 's2');
  master.fromTo('#wordmark',
    { scale: 2.4, opacity: 0, rotation: -6 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(4)' },
    1.55
  );
  master.to('#wordmark', { scale: 1.06, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 2.1);

  /* ---------- S3 : Tap (2.8 - 4.2) ---------- */
  cutTo(master, 2.8, 's2', 's3');
  master.fromTo('.tap-wrap', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, 2.9);
  master.fromTo('#ripple1', { scale: 0.3, opacity: 1 }, { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out', repeat: 1, repeatDelay: 0.1 }, 3.0);
  master.fromTo('#ripple2', { scale: 0.3, opacity: 1 }, { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out', repeat: 1, repeatDelay: 0.1, delay: 0.25 }, 3.0);
  master.fromTo('#s3 .punch', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, 3.1);

  /* ---------- S4 : Car arrives (4.2 - 5.6) ---------- */
  cutTo(master, 4.2, 's3', 's4');
  master.fromTo('#speedlines', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 4.3);
  master.fromTo('#car-body', { x: -260 }, { x: 0, duration: 0.55, ease: 'power3.out' }, 4.3);
  master.to('#car-body', { x: 6, duration: 0.08, yoyo: true, repeat: 3, ease: 'power1.inOut' }, 4.85); // bounce stop
  master.to('#speedlines', { opacity: 0, duration: 0.2 }, 4.85);
  master.fromTo('#s4 .punch', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, 5.0);

  /* ---------- S5 : pin + route (5.6 - 7.0) ---------- */
  cutTo(master, 5.6, 's4', 's5');
  master.to('#route-path', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 5.7);
  master.to('#pin', { scale: 1, duration: 0.3, ease: 'back.out(5)' }, 6.3);
  master.to('#pin', { y: -10, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 6.6);
  master.fromTo('#s5 .punch', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, 6.4);

  /* ---------- S6/7/8 : word slams (7.0 - 10.0) ---------- */
  cutTo(master, 7.0, 's5', 's6');
  master.fromTo('#s6 .slam', { scale: 2.2, opacity: 0, rotation: -4 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'back.out(5)' }, 7.1);

  cutTo(master, 8.0, 's6', 's7');
  master.fromTo('#s7 .slam', { scale: 2.2, opacity: 0, rotation: 4 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'back.out(5)' }, 8.1);

  cutTo(master, 9.0, 's7', 's8');
  master.fromTo('#s8 .slam', { scale: 2.2, opacity: 0, rotation: -4 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'back.out(5)' }, 9.1);

  /* ---------- S9/10/11 : feature flashes (10.0 - 14.8) ---------- */
  cutTo(master, 10.0, 's8', 's9');
  master.fromTo('#s9 .icon-feature', { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(4)' }, 10.1);
  master.fromTo('#s9 .feature-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 10.25);

  cutTo(master, 11.6, 's9', 's10');
  master.fromTo('#s10 .icon-feature', { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(4)' }, 11.7);
  master.fromTo(['#radar1', '#radar2'], { scale: 0.2, opacity: 1 }, { scale: 2.6, opacity: 0, duration: 0.9, ease: 'power2.out', stagger: 0.3, repeat: -1 }, 11.7);
  master.fromTo('#s10 .feature-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 11.85);

  cutTo(master, 13.2, 's10', 's11');
  master.fromTo('.stars span', { scale: 0, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, stagger: 0.08, ease: 'back.out(5)' }, 13.3);
  master.fromTo('#s11 .feature-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 13.6);

  /* ---------- S12 : city drive (14.8 - 19.0) ---------- */
  cutTo(master, 14.8, 's11', 's12');
  master.fromTo('#skyline', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 14.9);
  master.fromTo('#city-car', { x: -100 }, { x: 480, duration: 3.6, ease: 'power1.inOut' }, 15.1);
  master.fromTo('#s12 .city-caption', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 15.3);

  /* ---------- S13 : arrival check (19.0 - 21.0) ---------- */
  cutTo(master, 19.0, 's12', 's13');
  master.fromTo('.icon-check', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(4)' }, 19.1);
  master.to('#check-path', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 19.3);
  master.fromTo('#s13 .punch', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, 19.6);

  /* ---------- S14 : headline (21.0 - 25.0) ---------- */
  cutTo(master, 21.0, 's13', 's14');
  master.fromTo('.cta-headline', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(3)' }, 21.1);
  master.to('.cta-headline', { letterSpacing: '0.01em', duration: 2.8, ease: 'power1.out' }, 21.8);

  /* ---------- S15 : CTA (25.0 - 30.0) ---------- */
  cutTo(master, 25.0, 's14', 's15');
  master.to('.cta-wordmark', { opacity: 1, duration: 0.3 }, 25.1);
  master.fromTo('.cta-btn', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(4)' }, 25.3);
  master.to('.cta-btn', { scale: 1.05, duration: 0.5, yoyo: true, repeat: -1, ease: 'power1.inOut' }, 25.8);

  confettiPieces.forEach((p, i) => {
    const angle = (i / confettiPieces.length) * Math.PI * 2;
    const dist = 180 + Math.random() * 180;
    master.fromTo(p,
      { x: 0, y: 0, opacity: 1, rotation: 0 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 60,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 1.4 + Math.random() * 0.6,
        ease: 'power2.out'
      },
      25.2 + Math.random() * 0.2
    );
  });

  master.to('#stage', { duration: 1.2 }, 28.8); // hold on end frame

  return master;
}

const tl = buildTimeline();
tl.play();

document.getElementById('replay-btn').addEventListener('click', () => {
  document.getElementById('replay-btn').classList.remove('visible');
  tl.restart();
});
