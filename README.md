
# FFXII Run Tracker

Companion tracker for *Final Fantasy XII* (IZJS / The Zodiac Age) rewritten on top of **Next.js 15**, Tailwind CSS and shadcn/ui.

Key highlights:

- Consumes the canonical `walkthrough.json` to build the dashboard, guide list and per-section view.
- Three-column guide page with sidebar navigation, checklist com filtros e painel contextual (lojas, loot alerts e narrativa).
- Dark theme first with future-ready light theme support via next-themes + Zustand UI store.
- Toggle global para nomes em japonês aplicado em seções, lojas e inventário.
- Inventário virtual sincronizado com shops e estado de playthrough (XP, nível, progresso, hunts).

## Development

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` following the Next.js App Router conventions.
  