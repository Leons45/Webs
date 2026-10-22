# webs

Static sites hosted on GitHub Pages: https://leons45.github.io/webs/

## Pages

- **`/`** — The Iron Sovereign: original dark-fantasy concept landing page (not affiliated with any film/comic/studio).
- **`/portfolio/`** — Personal portfolio. Exaggerated-minimalism + motion-driven style, with a Three.js wireframe scene in the hero.
- **`/atlas/`** — An Atlas of Imaginary Insects: a pannable/zoomable specimen drawer, not a scrolling page. Every creature is procedurally generated SVG (deterministic seeded RNG, no stock art), individually draggable, with a detail drawer per specimen.
- **`/refraction/`** — "Refraction": a real WebGL piece built with **React 19 + Three.js + React Three Fiber + drei + postprocessing + Framer Motion**, compiled with Vite. A hand-jittered glass crystal with physically based transmission/refraction/chromatic aberration, bloom + vignette postprocessing, scroll-driven camera dolly, and cursor parallax. Source lives in `/refraction-src/` (not auto-built by Pages — rebuild locally with `npm install && npm run build`, then copy `dist/` over `/refraction/`).

## Stack / tooling notes

- Plain self-contained HTML/CSS/JS per page — no build step, so GitHub Pages serves it as-is.
- Design direction pulled from the `ui-ux-pro-max` skill (style/typography/color/motion search).
- **[Three.js](https://github.com/mrdoob/three.js)** — used in `/portfolio/` for the hero's animated wireframe icosahedron (loaded from jsdelivr CDN as an ES module, respects `prefers-reduced-motion`).
- **[Excalidraw](https://github.com/excalidraw/excalidraw)** — not integrated into the code; kept as a visual/UX reference for clean, minimal product design when sketching new pages.

## Adding a new page

Create a new folder with its own `index.html` (self-contained — fonts via Google Fonts `<link>`, no external build tooling), commit, push to `main`. GitHub Pages serves it at `https://leons45.github.io/webs/<folder>/` automatically.
