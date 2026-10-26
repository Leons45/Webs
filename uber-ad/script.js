/* =========================================================
   30-second concept ad — master GSAP timeline
   Scenes are labeled on the timeline so timing is easy to
   retune: just slide labels or change duration numbers below.
   ========================================================= */

gsap.registerPlugin(MotionPathPlugin);

function buildTimeline() {

  const master = gsap.timeline({
    paused: true,
    onComplete: () => {
      document.getElementById('replay-btn').classList.add('visible');
    },
    onUpdate: () => {
      const p = master.progress() * 100;
      document.getElementById('progress-fill').style.width = p + '%';
    }
  });

  // split text elements once, up front
  const wordmarkSplit = new SplitType('#wordmark', { types: 'chars' });
  const lineASplit = new SplitType('.line-a', { types: 'words,chars' });
  const lineBSplit = new SplitType('.line-b', { types: 'words,chars' });
  const lineCSplit = new SplitType('.line-c', { types: 'words,chars' });
  const ctaSplit   = new SplitType('.cta-headline', { types: 'words,chars' });

  gsap.set(wordmarkSplit.chars, { opacity: 0, y: 60, rotateX: -60 });
  gsap.set([lineASplit.chars, lineBSplit.chars, lineCSplit.chars], { opacity: 0, y: 30 });
  gsap.set(ctaSplit.chars, { opacity: 0, y: 40 });

  /* ---------------- SCENE 1 : brand intro  0s -> 5s ---------------- */
  master.addLabel('scene1', 0);
  master.set('#scene-1', { opacity: 1, visibility: 'visible' }, 'scene1');
  master.fromTo('.bg-sweep',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' },
    'scene1'
  );
  master.to(wordmarkSplit.chars, {
    opacity: 1, y: 0, rotateX: 0,
    duration: 0.9, stagger: 0.06, ease: 'back.out(1.7)'
  }, 'scene1+=0.3');
  master.to('#scene-1', { opacity: 0, duration: 0.6 }, 'scene1+=4.2')
        .set('#scene-1', { visibility: 'hidden' });

  /* ---------------- SCENE 2 : kinetic value prop  5s -> 15s --------- */
  master.addLabel('scene2', 5);
  master.set('#scene-2', { opacity: 1, visibility: 'visible' }, 'scene2');

  master.to(lineASplit.chars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.025, ease: 'power3.out' }, 'scene2+=0.1');
  master.to(lineASplit.chars, { opacity: 0, y: -20, duration: 0.4, stagger: 0.015 }, 'scene2+=2.3');

  master.to(lineBSplit.chars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.025, ease: 'power3.out' }, 'scene2+=2.7');
  master.to(lineBSplit.chars, { opacity: 0, y: -20, duration: 0.4, stagger: 0.015 }, 'scene2+=5.0');

  master.to(lineCSplit.chars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.025, ease: 'power3.out' }, 'scene2+=5.4');
  master.to('#scene-2', { opacity: 0, duration: 0.6 }, 'scene2+=9.2')
        .set('#scene-2', { visibility: 'hidden' });

  /* ---------------- SCENE 3 : feature beats  15s -> 25s -------------- */
  master.addLabel('scene3', 15);
  master.set('#scene-3', { opacity: 1, visibility: 'visible' }, 'scene3');

  master.to('.feature[data-idx="1"]', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 'scene3+=0.2');
  master.to('.feature[data-idx="2"]', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 'scene3+=0.6');
  master.to('.feature[data-idx="3"]', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 'scene3+=1.0');

  // route line draws itself, dot travels along the path
  master.to('#route-path', { strokeDashoffset: 0, duration: 3.5, ease: 'power1.inOut' }, 'scene3+=1.6');
  master.to('#route-dot', {
    motionPath: { path: '#route-path', align: '#route-path', alignOrigin: [0.5, 0.5] },
    duration: 3.5, ease: 'power1.inOut'
  }, 'scene3+=1.6');

  master.to('#scene-3', { opacity: 0, duration: 0.6 }, 'scene3+=9.0')
        .set('#scene-3', { visibility: 'hidden' });

  /* ---------------- SCENE 4 : CTA end frame  25s -> 30s -------------- */
  master.addLabel('scene4', 25);
  master.set('#scene-4', { opacity: 1, visibility: 'visible' }, 'scene4');

  master.to(ctaSplit.chars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.02, ease: 'power3.out' }, 'scene4+=0.2');
  master.to('.cta-wordmark', { opacity: 1, duration: 0.5 }, 'scene4+=1.0');
  master.to('.cta-btn', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 'scene4+=1.3');

  master.to('#stage', { duration: 1.5 }, 'scene4+=3.5'); // hold on end frame

  return master;
}

const tl = buildTimeline();
tl.play();

document.getElementById('replay-btn').addEventListener('click', () => {
  document.getElementById('replay-btn').classList.remove('visible');
  tl.restart();
});
