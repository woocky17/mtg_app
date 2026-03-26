# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16 App Router** project bootstrapped with `create-next-app`. It is currently a starter template — the main app code lives in `src/app/`.

- `src/app/layout.tsx` — Root layout with Geist font variables applied to `<body>`
- `src/app/page.tsx` — Home page (entry point to build the MTG app)
- `src/app/globals.css` — Global styles (Tailwind CSS v4)

**Key setup details:**
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`)
- Tailwind CSS v4 via `@tailwindcss/postcss`
- TypeScript with strict mode (see `tsconfig.json`)
- No test framework is configured yet
