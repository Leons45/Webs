import * as srs from '../srs.js';
import * as store from '../store.js';
import { runner } from './_runner.js';

export default function reviser(el, { go }) {
  const queue = srs.queue();
  const c = srs.counts();

  return runner(el, queue, {
    title: 'Session du jour',
    subtitle: `${c.due} à revoir · ${Math.max(0, queue.length - c.due)} nouvelle${queue.length - c.due === 1 ? '' : 's'} · objectif ${store.settings().dailyGoal}`,
    onFinish: () => go('#/reviser'),
  });
}
