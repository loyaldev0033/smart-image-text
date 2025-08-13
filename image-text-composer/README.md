# Image Text Composer

Desktop-only single-page image editor to upload a PNG and overlay fully customizable text layers. Built with Next.js (App Router), TypeScript, React Konva, and Zustand.

## Tech
- Next.js 14 + TypeScript
- React Konva + Konva (canvas interactions)
- Zustand (state, undo/redo, autosave)
- Tailwind CSS (UI)
- WebFontLoader + Google Fonts API

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set Google Fonts API key for full font list:
- Env: set `NEXT_PUBLIC_GOOGLE_FONTS_API_KEY` in `.env.local`
- Or paste in browser console/localStorage:
```js
localStorage.setItem('GOOGLE_FONTS_API_KEY', 'YOUR_KEY')
```

3. Run dev server:
```bash
npm run dev
```
Open http://localhost:3000

## Usage
- Upload a PNG. Canvas matches image aspect ratio. Export preserves original dimensions.
- Add multiple text layers. Drag, rotate, resize (corner handles, right-side width handle).
- Edit text, font family, size, weight, color, opacity, alignment, and multi-line content in the Inspector.
- Reorder layers in the left panel. Arrow keys nudge (Shift for 10px). Snap to canvas center with guides.
- Undo/Redo with history indicator. State autosaves to localStorage and restores on reload. Reset clears all.

## Architecture
- `src/store/designStore.ts`: Central state with actions, undo/redo ring buffers, autosave, and export.
- `src/components/canvas/CanvasStage.tsx`: Konva stage, background image, text nodes, transformer, guides.
- `src/components/panels/*`: Toolbar, layers list, inspector.
- `src/components/controls/*`: Small reusable inputs (font picker, numeric field).
- `src/lib/fonts.ts`: Fetches Google font families list.

### State Model
- Background: stored as dataURL in autosave; hydrated to `HTMLImageElement` on load.
- Layers: array of text layers with geometry and typography props.
- History: past/future stacks (limit 50). Each mutating action pushes a snapshot and updates localStorage.

## Trade-offs
- React Konva selected for robust transforms, good perf, and straightforward export.
- WebFontLoader to request families/weights on demand. Fallback curated list without API key.
- Simple reordering buttons instead of drag-and-drop to reduce complexity.

## Bonus Ideas (not all implemented)
- Custom font upload (TTF/OTF/WOFF) via `@font-face` runtime registration
- Multi-select with grouped transforms
- Line-height and letter-spacing controls
- Lock/duplicate layers, text shadows
- Smart spacing hints between layers

## Deployment
- Deploy to Vercel: connect repo, set `NEXT_PUBLIC_GOOGLE_FONTS_API_KEY` if needed.

## Limitations
- No mobile/touch UI
- PNG import/export only