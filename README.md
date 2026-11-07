# CAHOOT Comic Scroll Edition

> **For AI coding agents:** This is the complete source for the CAHOOT website. Read this README before changing anything. The live website is a static, animated, single-page experience; preserve its artwork, scroll sequence, mobile layout, and existing copy unless the owner asks otherwise.

## Comic edition

This version uses Lilita One comic headlines, Gochi Hand handwritten notes, and letters that assemble as the visitor scrolls. Edit `dist/comic.css` for the added typography and `dist/app.js` for the reveal animation. See AGENTS.md for AI contributor guidance.

## Run locally

No dependencies or build step are required. From the repository root:

```sh
python -m http.server 8000 --directory dist
```

Open http://localhost:8000. Deploy the `dist` directory as a static site. `vercel.json` configures Vercel to serve that directory.

## Where to make changes

- `dist/index.html` contains the page content, layout, and CSS, including responsive rules.
- `dist/app.js` controls the scroll animation, flying owls, sprite frames, and moving sky.
- `dist/assets/` contains the original sprite sheets, logo, and sky images. `sky-hd-v4.png` is the current 1920 × 5760 sky; earlier sky assets preserve prior artwork.

The sky is displayed at its natural proportions and moves as the page scrolls. The flying owl sprite sheets use a 6 × 6 grid. The campfire animation uses a separate 6 × 6 sheet. The owls fade out as the campfire appears. On mobile, the campfire is positioned near the bottom and the footer disclaimer is hidden; keep the desktop disclaimer unless instructed otherwise. Respect reduced-motion preferences.

## Content and project facts

Use CAHOOT for the brand, $CAHOOT and $HOOT for tokens, Hoot for the character, and JustHoot for the platform. Pairing, the 10% supply lock, and burns are **planned**, not verified as completed. Do not invent a contract address, transaction proof, lock terms, financial returns, endorsements, or rankings. The copy-address button stays disabled until a verified address is published. The JustHoot link points to https://justhoot.fun.

## Before shipping changes

Check the experience at desktop and mobile sizes, including the sky, scroll transitions, anchors, flying sprites, and the campfire finale. Run `node --check dist/app.js` for JavaScript syntax. Do not overwrite original artwork without the owner's direction.

## Deployment

Import this GitHub repository into Vercel with the included configuration, or run `vercel --prod` from the repository root. The site is static and does not require environment variables.



