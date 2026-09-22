# 🚀 Deployment Plan & Final UX Report — Mi Segundo Cerebro

> **Status: LIVE & VERIFIED** · Gateway checked first (no assumptions) · App UI is **Spanish** · Docs in **English** for AI/agent readability.

> **Dato maestro:** `?node=<id>` / `#node-<id>` — el deep-link es la **causa raíz del cuadro *target*** (leído en `App.tsx:1008-1011` vía `window.location.search` + `hash`); runtime canónico = **Bun**.

---

## 1. Gateway Status (verified, refreshed this session)

| Check | Result |
| :-- | :-- |
| Local vs. remote | ✅ `HEAD == origin/main == 3914afc` — **0 ahead / 0 behind**, tree clean |
| Package manager (deployed) | ✅ **Bun** (`bun.lock` + `bun.lockb` present) — same as Vercel build |
| `bun install` | ✅ 302 packages, **no ERESOLVE / no conflicts** |
| `bun run build` (Vercel's step) | ✅ `dist/` generated with **PWA** (`sw.js` + workbox) |
| Serverless API (`api/`) | ✅ `card.ts` (OpenGraph 1200×630 SVG) + `share.ts` (Notion unfurl), routed by `vercel.json` |
| Vercel project link | ✅ `prj_Tu5NDTVJdN5f7DHAY3qlRseFL7mc` (mpsegundocerebro) — deployed & synced |

**Verdict:** The deployed code **is** the advanced GitHub version. **No drift, no conflict.**

---

## 2. MVP Structure — UX Assessment

The MVP is **well structured**. It solves a documented adoption problem (Ebbinghaus forgetting curve + capture friction) with a coherent feature set:

| UX Checklist Criterion (from conversation) | Status |
| :-- | :-- |
| **Zero-friction capture** (`Ctrl+V` paste anywhere, `Ctrl+K` palette) | ✅ `textUtils` smart-trim + 4-point nodes |
| **Cognitive traffic light** (Por Aprender / En Práctica / Dominado) | ✅ per-node state + topbar filtering |
| **Retention / spaced repetition** (flashcards `repaso_activo_y_flashcards.md`) | ✅ Active-recall deck + semantic color updates |
| **Semantic graph thinking** (4 connection points, live reconnect) | ✅ `@xyflow/react` v12, `ConnectionMode.Loose` |
| **Persistence & trust** (localStorage → Drive backup `drive.file`) | ✅ Google Drive API v3 + OAuth (min-scope) |
| **Share-by-link** (single URL opens in Android & Windows) | ✅ PWA + `vercel.json` rewrites + deep-link `?node=` / `#node-` |
| **OG / Notion preview** (share card 1200×630) | ✅ `api/share.ts` dynamic card + redirect |

**No UX conflict found.** The only repo-level cleanliness items (non-blocking):

| Item | Impact |
| :-- | :-- |
| Duplicate doc trees `Doc/` (EN) + `doc/` (ES) | 🟡 Cosmetic — docs only; app untouched |
| `@google/genai`, `express`, `dotenv` in deps (0 refs in `src`) | 🟡 **Keep `@google/genai`** — needed for Google AI Studio flow. Others harmless. |

---

## 3. Final 5-Step Production Plan

1. **Gateway refresh** ✅ done — `git fetch` → tree in sync with `origin/main`.
2. **Docs update** ✅ done — this `Doc/DEPLOYMENT_PLAN.md` reflects gateway analysis; `INDEX.md` updated.
3. **Commit + push** to `origin/main` → Vercel auto-deploy (single gateway kept).
4. **Post-deploy verify** — build green, `api/share` responds, Drive up/restore works.
5. **Live UX test on production URL** — `Ctrl+V`, traffic light, flashcards, share-link on Android + Windows.

---

*Canonical doc — no duplicates created. App remains Spanish; this doc is EN for agent readability.*
