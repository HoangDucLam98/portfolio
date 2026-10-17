# Sproutling 3D Game Studio — Portfolio

An interactive, scrollytelling 3D portfolio for **Hoang Duc Lam**, Gameplay Programmer & Technical 3D Game Artist. Visitors scroll through a fully procedural floating sky-island studio (Three.js) rendered behind classic DOM overlays, with a playable 3D mini-game, achievements, dynamic time-of-day lighting and synthesized WebAudio sound.

**Live:** https://hoangduclam98.github.io/portfolio/

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8** (Rolldown)
- **Three.js** via `@react-three/fiber` / `@react-three/drei` — 100% code-generated 3D, no external models
- **Tailwind CSS 4** (via `@tailwindcss/vite`) + Framer Motion for UI motion
- **canvas-confetti** for celebratory moments
- **oxlint** for linting
- WebAudio oscillator-based sound engine (`src/audio/audioEngine.ts`) — zero audio files

## Features

- **Scrollytelling 3D scene** — five stations (Hero, About/CLI, Skills, Projects, Contact) with an animated camera rig driven by scroll progress
- **Playable 3D mini-game** — press `G` or use the Switch button: guide the Sproutling to collect 5 golden stars (WASD/arrows; on-screen D-pad on mobile). Press `Esc` to exit
- **8 achievements** with toast notifications, persisted in `localStorage`
- **Time of day** — day / sunset / night lighting presets; **Diorama mode** for a tilt-shift miniature look
- **Data-driven content** — edit one file to update projects (`src/data/portfolioData.ts`) and skills (`src/data/skillsData.ts`)
- **Performance-aware rendering** — device profiling lowers DPR, shadows and particle counts on low-power hardware; honors `prefers-reduced-motion`
- **Accessible modals** — focus trap, `Esc` to close, restored focus, ARIA labelling
- **WebGL fallback** — graceful message for devices without WebGL support

## Getting Started

Requires Node.js 20+.

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Configuration

### Contact form

The form posts JSON to a configurable endpoint (works with [Formspree](https://formspree.io), Web3Forms, Getform, etc.). Create a `.env.local` file:

```bash
VITE_CONTACT_ENDPOINT=https://formspree.io/f/your-form-id
```

If `VITE_CONTACT_ENDPOINT` is **not** set, the form falls back to opening the visitor's email client with the message pre-filled (`mailto:`), so it still works out of the box. A hidden honeypot field filters basic bots.

> Note for GitHub Pages deployment: add the same variable as a repository secret and expose it during the build step if you want a live endpoint in production.

### Game trailers

Add an optional `trailerUrl` to any project in `src/data/portfolioData.ts`:

```ts
trailerUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX", // YouTube link -> embedded player
// or a direct file:
trailerUrl: "https://example.com/trailer.mp4",
```

A "Trailer" tab automatically appears in the project modal next to the screenshot gallery.

### Social links

Edit `personalInfo.socials` in `src/data/portfolioData.ts`. Empty/omitted entries are hidden automatically.

### Resume / CV

The downloadable resume lives at `public/HoangDucLam_CV.pdf`, generated from the template `cv/hoang-duc-lam-cv.html`. To regenerate after editing the template:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --no-pdf-header-footer --no-sandbox \
  --print-to-pdf=public/HoangDucLam_CV.pdf \
  "file://$PWD/cv/hoang-duc-lam-cv.html"
```

"Download CV" buttons in the hero and contact sections link to it automatically via `import.meta.env.BASE_URL`.

## Project Structure

```
src/
├── App.tsx                  # State hub: sections, mini-game, modals
├── components/
│   ├── 3d/                  # R3F scene: Workspace island, Skills, Projects, Contact
│   └── ui/                  # DOM overlays: Hero, About, Skills, Projects, Contact, modals, HUD
├── data/                    # portfolioData.ts, skillsData.ts (all content lives here)
├── game/achievements.ts     # Achievement manager (localStorage, pub/sub)
├── audio/audioEngine.ts     # WebAudio synthesizer
├── hooks/useModalA11y.ts    # Focus trap + Esc handling for dialogs
└── types/index.ts           # Shared types
```

## Deployment

Two options are already wired up:

1. **GitHub Actions** (`.github/workflows/deploy.yml`) — builds and deploys to GitHub Pages on every push to `main`/`master`.
2. **gh-pages CLI** — `npm run deploy` (builds then pushes `dist/` to the `gh-pages` branch).

`vite.config.ts` sets `base: '/portfolio/'` — change this if you deploy to a different path or a custom domain (also update the absolute URLs in `index.html` for Open Graph/SEO).

## License

Personal portfolio content (games, screenshots, copy) © Hoang Duc Lam. Code is available for reference — please don't republish the content as your own.
