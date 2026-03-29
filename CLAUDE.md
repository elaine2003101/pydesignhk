# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **React 18** + **TypeScript** - UI framework
- **Vite 6** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router 7** - Client-side routing (hash-based)
- **Supabase** - Authentication and backend services
- **Radix UI** - Accessible component library
- **Recharts** - Data visualization

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Root component with RouterProvider
│   ├── routes.tsx           # Router configuration (hash-based routing)
│   ├── components/
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   └── ui/              # Radix UI components (auto-generated)
│   └── pages/               # Page components (Home, Inspiration, GetEstimate, etc.)
├── styles/                  # Global CSS (Tailwind, fonts, theme)
└── main.tsx                 # React app entry point
public/                      # Static assets and images
```

## Key Development Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Build for production (outputs to ./dist)
npm ci               # Install dependencies (used in CI/CD)
```

## Important Configuration Notes

### Vite Base URL

**Critical**: The Vite config has `base: '/pydesignhk/'` because this app is deployed to a GitHub Pages subdirectory.

**When referencing public assets** (images, etc.), always use:
```typescript
const baseURL = import.meta.env.BASE_URL;
const imagePath = `${baseURL}image-name.png`;
```

**DO NOT** use paths like `/image.png` or `image.png` directly — they will result in 404 errors in production.

This is enforced in `src/vite-env.d.ts` which includes `BASE_URL` in the `ImportMetaEnv` interface.

### Routing

- Uses **hash-based routing** (`createHashRouter`) for GitHub Pages compatibility
- All routes are nested under a Layout component
- Main routes: `/`, `ideas`, `estimate`, `track`, `login`, `signup`, `forgot-password`, `reset-password`, `auth/callback`, `admin`

## Deployment

### GitHub Pages Deployment

Automated via `.github/workflows/deploy.yml`:
1. Triggers on push to `main` branch
2. Runs `npm ci` → `npm run build`
3. Uploads `./dist` directory to GitHub Pages
4. Deployment typically completes in 1-2 minutes

**When deploying**: Push changes to `main`, check GitHub Actions tab for build status.

## Supabase Integration

Supabase client is configured for authentication. Environment variables in `.env.local`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_ADMIN_EMAILS`

## UI Component Library

The `src/app/components/ui/` directory contains auto-generated Radix UI component wrappers with Tailwind styling. These are the primary components used throughout the app.

## Color Theme & Styling

- Primary colors: Browns and neutral tones (`#8B6F4E`, `#1C1C1C`, `#F9F8F6`)
- Styling: Tailwind CSS with custom animations and theme colors
- Theme managed in `src/styles/theme.css`
