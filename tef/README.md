# L'Atelier — TEF Canada

A daily training app for the TEF Canada exam. No build step, no account, no
server: open it and work. Everything is stored in the browser, and it runs
offline after the first visit.

## What it does

**Révision espacée.** An SM-2 scheduler over a bank of grammar, usage and
vocabulary cards. Cards you miss come back in six minutes; cards you know
drift out to weeks. The queue leads with your weakest tags, so the hard
material gets the freshest attention rather than the tail end of a session.

**Atelier.** A drill built only from the tags you are actually failing.
Running accuracy per tag is tracked on every answer across every mode, so
the diagnosis comes from your work, not from a placement test.

**Compréhension écrite.** Original passages in all four TEF formats —
short notices, informative texts, two texts to compare, and a gap-fill.
The whole set is marked at once, as in the exam, with an explanation per
question.

**Compréhension orale.** Scripts are spoken by the browser's French voice,
so there are no audio files to download and you can slow the delivery to
0.75× while you build the ear, then take it back up. Replays are capped at
two. The transcript unlocks after marking.

**Dictée.** You hear a sentence and write it; the two versions are then
diffed word by word. Every sentence was chosen because its error is silent
— a participle agreement, an auxiliary, a negation out of position. This is
the fastest way to find out which of your mistakes you cannot hear.

**Expression orale.** Prep timer, task timer, microphone recording and
playback, plus a five-criterion self-assessment. Recordings stay on the
device.

**Expression écrite.** Timed composition on a ruled sheet with a live word
count, a clickable bank of connectors and formal formulas, and a mechanical
pass that flags spoken register, incomplete negation, a missing concession,
and `mais` used three times.

**Progrès.** Practice accuracy is placed on the official TEF module scales
(CO /360, CE /300, EE /450, EO /450) and read against IRCC's published NCLC
bands for exams taken from 11 December 2023 onward. The page leads with the
only number that governs eligibility: your weakest skill.

## Running it

It is a static site. Open `index.html` over any HTTP server:

```
python3 -m http.server 8000
```

Or use the hosted copy on GitHub Pages.

## Notes

- Score estimates steer revision. They are not a prediction of exam day, and
  the expression modules are only as honest as your self-marking. Check the
  current bands on the IRCC site before making any decision about a file.
- Listening needs a French voice installed in the browser. Chrome, Edge and
  Safari ship one; on Windows, add French under Settings → Time & language →
  Speech.
- Progress lives in `localStorage` for this origin. Export a backup from
  Réglages before clearing browser data or switching devices.

## Structure

```
index.html          shell
css/app.css         the whole design system
js/app.js           hash router, nav, theme
js/store.js         persistence, streak, day log
js/srs.js           SM-2 scheduling and queue building
js/scoring.js       TEF scales, NCLC bands, estimator
js/speech.js        synthesis, recognition, recording
js/views/*.js       one file per screen
js/data/*.js        the content bank
sw.js               offline cache
```

## Design

The surface is *papier Séyès* — the ruled French exercise book — with
fountain-pen navy for the voice. Red and green are the teacher's two
correction pens and are never decoration: red marks an error or a weak
point, green marks something right or consolidated. Spectral sets the
French; Archivo sets the interface.
