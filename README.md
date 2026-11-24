# Study Room (playable prototype)

A small 2D point-and-click room game. No backend, no assets to download, no cost.

## Run locally

```bash
cd ~/study-room-game
npm install       # one time
npm run dev       # dev server, open the printed URL
```

Production build:

```bash
npm run build     # output in dist/
npm run preview   # serve the built files locally
```

## Controls

- **Boy / Girl** buttons — switch character
- **Click the floor** — walk there
- **Click the chair** — walk over and sit down
- **Click the laptop** — zoom into the laptop screen (Close button returns)
- **Click the coffee cup** — empty / refill (steam animates when full)
- **Click the window** — dim the daylight
- Wall clock shows your real local time

## Deploy for $0

- **Cloudflare Pages**: connect this folder or upload `dist/`, free tier allows commercial use.
- **GitHub Pages**: push `dist/` (or the repo with a Pages action) — also free and commercial-safe.

`vite.config.ts` sets `base: './'`, so the built files work from any subpath.

## Licensing

PixiJS, Vite and TypeScript are MIT/Apache licensed — safe for commercial use.
All artwork is drawn in code (no third-party images, audio, or fonts), so there is
nothing external to attribute or pay for.
