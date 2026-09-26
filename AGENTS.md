# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Commands

- `npm run build` — gulp build into `dist/` (runs `clean` first via `prebuild`).
- `npm run lint` — everything in parallel: stylelint, ESLint, and both tsc projects.
- `npm run lint:typecheck:frontend` / `npm run lint:typecheck:serviceworker` — type-check one bundle.
- `npm run lint:eslint` — ESLint over JS/TS/CSS/JSON/Markdown/package.json (all handled by `eslint.config.js`).
- `npm run check` — post-build compatibility checks on `dist/`: `es-check es2017` on the JS and `scripts/check-css-compat.js` (doiuse against the `browserslist` in `package.json`) on the CSS. Requires a prior `npm run build`.

There is no test suite and no dev server. CI (`.github/workflows/CI.yml`) runs `npm run build` followed by `npm run check`, and `npm run lint`.

## Architecture

A dependency-free, non-module frontend: TypeScript files are compiled and **concatenated** into two global-scope bundles, `dist/frontend.min.js` and `dist/serviceworker.min.js`. There is no bundler, no `import`/`export` in `src/ts`, and no ES modules at runtime.

Consequences to respect when editing `src/ts`:

- Every symbol lives in one shared global scope. Cross-file visibility is expressed with `/* exported X */` and `/* global X:true */` comments at the top of each file (ESLint enforces this; there are no imports).
- **File membership and concatenation order are declared explicitly in `frontend.tsconfig.json` and `serviceworker.tsconfig.json`** (`files` arrays). A new `.ts` file is invisible to both the build and the type-check until it is added there.
- Both bundles extend the root `tsconfig.json` (target `es2017`, which `npm run check` enforces on the output). The serviceworker project swaps in the `WebWorker` lib and drops the DOM/third-party types.
- Ambient declarations for the frontend's third-party globals live in `src/d.ts/frontend.d.ts`.

### Runtime shape

- `src/ts/main.ts` is the entry point (`window.onload`). It reads `CONFIG` from `document.documentElement.dataset.config`, which `src/html/index.php` injects server-side from `client-config.json` (see `client-config.json.sample`). All URLs (`api-uri`, `frontend-uri`, `frontend-resources-path`) come from there — never hardcode them.
- `AfterLoadEvent` is the ad-hoc async primitive used everywhere in place of promises: construct with a threshold, `trigger()` counts up and fires callbacks once the threshold is reached, `retrigger()` re-fires without counting, and `addCallback()` on an already-triggered event fires immediately. `retrigger` is how cached-then-network data updates a view a second time.
- `tools/request.ts` wraps XHR against the API and redirects to login on `403 RoleException`. `cacheThenNetworkRequest` fires two parallel requests — one normal, one with `Accept: x-cache/only` — and invokes the callback with a `cacheDataReceived` flag so views can render from cache and then re-render from the network.
- The service worker (`src/ts/serviceworker.ts`) implements the other half of that protocol: it serves `x-cache/only` requests purely from the `handbook-<version>` cache. The version string is injected at build time by replacing `INJECTED-VERSION` with `package.json`'s version, so **bumping the package version invalidates the cache**.
- `metadata.ts` loads and sorts the global `FIELDS`/`LESSONS`/`COMPETENCES` (`IDList` — an insertion-ordered key/value list) plus `LOGINSTATE`, exposing `metadataEvent` and `loginstateEvent`.
- `history.ts` owns client-side routing: it parses `window.location.pathname` (`/competence`, `/competence/:id`, `/field/:id`, `/lesson/:id`, else field list) and dispatches to the `showXView` functions in `src/ts/views/`. Adding a route means touching both `historySetup` and `historyPopback`.
- Lesson content is Markdown rendered by showdown with the custom `HandbookMarkdown` extension, then sanitised through `filterXSS` with `xssOptions()`. Any new HTML built from server data must keep going through that sanitiser.

### Build

`gulpfile.js` has one task per asset kind (`build:css`, `build:js`, `build:html`, `build:font`, `build:icon`, `build:php`, `build:png`, `build:txt`, `build:deps`), all run in parallel by `build`. CSS is concatenated into four bundles (`frontend`, `frontend-computer`, `frontend-handheld`, `error`) with explicit source lists in the gulpfile; custom properties are inlined at build time from `src/css/default-theme.css`, so a new CSS file must be added to the relevant bundle list. `showdown` and `xss` are copied from `node_modules` rather than bundled, and are loaded as `<script>` tags by `index.php`.
