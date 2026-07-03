# Mona Wang — Portfolio (Bento Dashboard)

A bento-grid "dashboard" portfolio with an Apple-style **Liquid Glass** material,
built from scratch as a static site (no build step).

**Live widgets:** typewriter intro · rotating dot-globe · live analog clock ·
animated skill radar · count-up stats · client marquee · dark/light morph toggle ·
cursor-reactive glass sheen. Two views (**Dashboard ⇄ Work**) with a spotlight-hover
work grid and counted filter pills.

## Stack
Vanilla HTML + CSS + JS. Fonts: SF (via `-apple-system` stack) + Instrument Serif.
Accent: `#75A8FF`.

## Develop
Open `index.html` in a browser. Deep-links: `?view=work`, `?theme=light`.

## Structure
- `index.html` — markup + SVG filter/aurora
- `styles.css` — design tokens, glass material, bento layout
- `app.js` — widgets & interactions
