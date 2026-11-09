// TEF Canada → NCLC. Band tables are IRCC's published equivalences for exams
// taken from 11 December 2023 onward, read on the module scales
// (CO /360, CE /300, EE /450, EO /450).
//
// The estimator turns your practice accuracy into a position on those scales.
// It is an indicator for steering revision, not a prediction of exam day.

export const MODULES = {
  co: { label:'Compréhension de l’oral',  short:'Oral',   max:360 },
  ce: { label:'Compréhension de l’écrit', short:'Écrit',  max:300 },
  ee: { label:'Expression écrite',        short:'Écrire', max:450 },
  eo: { label:'Expression orale',         short:'Parler', max:450 },
};

// [NCLC, floor, ceiling]
const BANDS = {
  co: [[4,145,180],[5,181,216],[6,217,248],[7,249,279],[8,280,297],[9,298,315],[10,316,360]],
  ce: [[4,121,150],[5,151,180],[6,181,206],[7,207,232],[8,233,247],[9,248,262],[10,263,300]],
  ee: [[4,181,225],[5,226,270],[6,271,309],[7,310,348],[8,349,370],[9,371,392],[10,393,450]],
  eo: [[4,181,225],[5,226,270],[6,271,309],[7,310,348],[8,349,370],[9,371,392],[10,393,450]],
};

// accuracy → module score, piecewise linear through calibrated anchors
const ANCHORS = {
  co: [[0,0],[.40,180],[.55,220],[.70,252],[.80,282],[.90,302],[1,335]],
  ce: [[0,0],[.40,150],[.55,185],[.70,210],[.80,235],[.90,255],[1,282]],
  ee: [[0,0],[.40,225],[.55,275],[.70,315],[.80,350],[.90,375],[1,412]],
  eo: [[0,0],[.40,225],[.55,275],[.70,315],[.80,350],[.90,375],[1,412]],
};

export function nclcFor(module, score) {
  const bands = BANDS[module];
  if (score < bands[0][1]) return 3;
  for (const [lvl, lo, hi] of bands) if (score >= lo && score <= hi) return lvl;
  return 10;
}

export function floorFor(module, nclc) {
  const b = BANDS[module].find(x => x[0] === nclc);
  return b ? b[1] : null;
}

export function estimateScore(module, accuracy) {
  if (accuracy == null) return null;
  const a = Math.max(0, Math.min(1, accuracy));
  const pts = ANCHORS[module];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    if (a <= x1) return Math.round(y0 + ((a - x0) / (x1 - x0)) * (y1 - y0));
  }
  return pts.at(-1)[1];
}

/** Rolling accuracy from the last n recorded results of a module. */
export function accuracyOf(results, n = 6) {
  if (!results || !results.length) return null;
  const slice = results.slice(-n);
  const score = slice.reduce((s, r) => s + r.score, 0);
  const total = slice.reduce((s, r) => s + r.total, 0);
  return total ? score / total : null;
}

/** Everything the progress view needs, per module. */
export function profile(store) {
  const res = store.get().results;
  const target = store.settings().target;

  return Object.keys(MODULES).map(m => {
    const acc = accuracyOf(res[m]);
    const score = estimateScore(m, acc);
    const nclc = score == null ? null : nclcFor(m, score);
    const need = floorFor(m, target);
    return {
      module: m, ...MODULES[m],
      attempts: (res[m] || []).length,
      accuracy: acc, score, nclc,
      target, targetFloor: need,
      gap: score == null || need == null ? null : need - score,
      met: score != null && need != null && score >= need,
    };
  });
}

/** Your retained level is your weakest skill — the single most useful fact. */
export function weakestSkill(prof) {
  const scored = prof.filter(p => p.nclc != null);
  if (!scored.length) return null;
  return scored.reduce((a, b) => (a.nclc <= b.nclc ? a : b));
}
