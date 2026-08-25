# Moonhaven Editor Agent Guide

Moonhaven-Editor is the companion authoring repository for the Moonhaven Unity
game. Agent workflows require the sibling `../Moonhaven` repository.

## Ownership

This repository owns:

- `SharedLibrary`: TypeScript interfaces, constants, converters, utilities,
  and validation shared by Electron and Unity/Jint
- `Editor`: Electron main/preload code, React/Redux authoring UI, data scripts,
  and wiki generation

The sibling `../Moonhaven` repository owns authoritative JSON, runtime art,
Unity C# consumers, game design docs, save formats, and the committed Jint
bundle.

## Read Before Changing

- Cross-repository workflow: `../Moonhaven/Docs/agent-workflow.md`
- Exact schemas: `../Moonhaven/Docs/data-schemas.md`
- Content and asset rules: `../Moonhaven/Docs/content-guide.md`
- Data architecture: `../Moonhaven/Docs/data-architecture.md`
- Dependency upgrades: `Editor/upgrade-plan.md`

If docs, production JSON, SharedLibrary, Unity C#, and Editor behavior disagree,
investigate the complete contract and report the conflict.

## Project Boundaries

### SharedLibrary

- Compiles to ES5/CommonJS for Unity's Jint runtime.
- Keep utility code pure and avoid runtime APIs unavailable to ES5/Jint.
- Centralize shared data contracts in `src/interface.ts`.
- Validation changes require rebuilding `../Moonhaven/Scripts`.

### Editor

- `src/main`: privileged Electron process and filesystem boundary
- `src/main/preload.ts`: narrow, typed context bridge
- `src/renderer`: unprivileged React/Redux UI
- `src/scripts`: deterministic data tools
- `src/wiki`: offline wiki generation, asset staging, and confirmed publishing

Never expose unrestricted Node/Electron APIs to the renderer. Validate IPC
senders, arguments, canonical paths, extensions, and payload sizes in main.

## Cross-Repository Contract

Schema changes can affect:

1. SharedLibrary interfaces, constants, converters, and validators
2. authoritative JSON and runtime art in `../Moonhaven`
3. Unity C# models and loading
4. Electron slices, save synchronization, and UI
5. wiki renderers and wiki-ready images
6. Moonhaven schema/design documentation
7. the committed Jint `app.js` bundle

Follow `../Moonhaven/Docs/agent-workflow.md`. Do not claim a schema change is
complete while any consumer or generated artifact is stale.

## Official documentation

Use official primary sources for version-sensitive APIs (Electron, Node,
React, Redux, MediaWiki). Documentation tools are optional and must not be
assumed to be configured.

## Verification

Prefer the sibling verifier:

```text
node ../Moonhaven/tools/verify.mjs --changed
node ../Moonhaven/tools/verify.mjs --scope editor
node ../Moonhaven/tools/verify.mjs --scope data
node ../Moonhaven/tools/verify.mjs --full
```

Direct commands:

```text
cd SharedLibrary && npm run check
cd Editor && npm run check
cd ../Moonhaven/Scripts && npm run check
```

Use Node 24 and npm 11 for Editor work. Verification commands must fail
nonzero on errors and must not publish wiki content or mutate production data.

## Content and Wiki Work

- Production JSON lives in
  `../Moonhaven/Moonhaven-Unity/Assets/StreamingAssets/data`.
- Use the shared content registry and validator; do not reproduce schema logic
  in individual components, scripts, or skills.
- Separate runtime validation, offline wiki build validation, wiki asset
  staging, and publishing.
- Missing wiki-only images do not make runtime content invalid, but they block
  a clean wiki asset check.
- Show exact page/image actions and ask immediately before publishing.
- Never overwrite unmanaged wiki art or invent missing art.

## Safety Boundaries

- Keep secrets in ignored `.env` files; commit only safe examples.
- Do not commit generated `SharedLibrary/dist`.
- Do not hand-edit `../Moonhaven/.../StreamingAssets/scripts/app.js`.
- Do not run wiki uploads, package releases, commits, pushes, or pull requests
  unless explicitly requested.
- Make focused changes and avoid unrelated boilerplate cleanup.

## Completion Report

Report changed files, checks run, skipped checks, companion SHA/impact,
generated artifact status, data/wiki validation, missing art, and any remaining
user decision.
