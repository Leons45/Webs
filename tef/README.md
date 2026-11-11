# L'Atelier — A2 → B2 for the TEF Canada

A daily programme for getting from A2 to the level CLB 7 asks for, built
around one idea: **at A2, comprehension improves on its own from exposure.
Production does not.** So just under half of every study day is spent
speaking, and the number the app puts first is minutes spoken.

No build step, no account, no server. Runs offline after the first visit.
English sits next to the French everywhere, and switches off when you stop
needing it.

## The day

Open it and the day arrives as a timetable, not a menu — at three to four
hours a day, deciding what to do next is itself a cost. Ten blocks, scaled
automatically to the hours you set:

| | block | what it trains |
|---|---|---|
| 🎙 | Échauffement | ten ready-made phrases, said aloud |
| | Vocabulaire | the week's themed chunks, spaced repetition |
| | Grammaire | one short lesson, then drills |
| 🎙 | Shadowing | hear it, repeat it at once, compare |
| 🎙 | Questions éclair | see English, say the French question |
| 🎙 | Section A | five timed minutes of asking only |
| 🎙 | Section B | ten minutes against spoken objections |
| 🎙 | Monologue | sixty seconds, no preparation |
| | Écriture | one short timed task |
| | Bilan | what resisted, and where you stand |

## Thirteen weeks

Weeks 1–13 run A2 → B2, each ending in a goal you can test yourself on
("ask ten different questions about an advert with no preparation", "land
three correct subjunctives in an argument"). The week decides which grammar
lesson and which vocabulary theme the day's blocks draw on.

## What's distinctive

**Section B objections are spoken aloud.** The examiner's five objections
play through the French voice at intervals while you are recording, so you
have to react in real time instead of reciting a prepared speech.

**The phrase bank is organised by function, not topic** — survival,
buying time and repairing, Section A asking, Section B persuading. The
"buying time" group is the highest-value one at A2: a B2 speaker is not
someone who never hesitates, it is someone who hesitates *in French*.

**Grammar is ordered by what it unblocks**, not by tradition. Lesson 2 is
the three ways of forming a question, because Section A is five minutes of
nothing else.

**The level ladder is explicit and cannot be gamed.** Five rungs, each with
three conditions — hours spoken, lessons passed at 70%, drill accuracy — and
all three must be met. Hours spoken is deliberately the slowest: you can
read a grammar in an afternoon, you cannot shortcut the sixty hours of
production that separate A2 from B2.

**The pace check does the arithmetic honestly.** It compares the speech you
still owe against the days remaining and tells you plainly whether the
current rate gets you there.

**Sujets prepares the real Expression Écrite prompts, not generic essays.**
Candidates' reported exam prompts (Section A narratives, Section B opinion
letters) are grouped into the handful of themes they keep recurring from —
children & heroics, police & mystery, technology & screens, school,
environment, and so on. Each theme carries its own vocabulary chunks with a
full example sentence, tracked through the same spaced repetition as
Phrases and Vocabulaire, plus a checklist of the actual prompts so you can
mark which ones you've rehearsed and watch the count climb toward the full
list.

## Running it

A static site. Any HTTP server will do:

```
python3 -m http.server 8000
```

## Notes

- Speech needs a French voice in the browser. Chrome, Edge and Safari ship
  one; on Windows add French under Settings → Time & language → Speech.
- Recordings stay on the device and are never uploaded.
- Progress lives in `localStorage` for this origin. Export a backup from
  Réglages before clearing browser data or switching devices.
- The NCLC equivalences shown are IRCC's published bands, but only a real
  TEF Canada gives an official score. Check the current bands on the IRCC
  site before making any decision about a file.

## Structure

```
index.html          shell
css/app.css         the design system
js/app.js           router, nav, English toggle
js/plan.js          the day's timetable + the thirteen weeks
js/level.js         the ladder, the gaps, the pace arithmetic
js/store.js         persistence; speakingSeconds is the key field
js/srs.js           spaced repetition over any item
js/i18n.js          English assistance
js/speech.js        synthesis, recognition, recording
js/views/*.js       one file per screen
js/data/*.js        phrases, grammar, vocabulary, speaking, writing, sujets
sw.js               offline cache
```

## Design

The language is **risograph poster printing**: flat saturated inks, hard ink
outlines, and solid offset shadows that collapse when you press them.
Nothing is soft-shadowed — depth comes from offset, not blur.

One colour per section, so the app is navigable by colour before you read a
word: yellow for today's programme, pink for speaking, orange for phrases,
blue for grammar, green for vocabulary, violet for writing. Every component
picks it up through a single `--accent` custom property set on `<html>`.

Bricolage Grotesque sets the display and the interface; Spectral sets the
French itself, so the language you are learning always looks different from
the apparatus around it — including the English gloss, which is deliberately
sans-serif and quiet so you can learn to stop seeing it.

### The feedback layer

- a **live waveform** off the recording stream, because the one thing that
  makes speaking practice feel like an instrument rather than a form is
  seeing the microphone respond
- a **rubber stamp** that thwacks down when a block is finished, plus confetti
- **synthesised tones** for right, wrong and done — no audio files to ship
- animated counters, slammed-in examiner objections, pressable everything

All of it respects `prefers-reduced-motion`, and the sound can be switched
off in Réglages.
