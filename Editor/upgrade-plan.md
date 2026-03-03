# Moonhaven-Editor Upgrade Plan (LLM-Executable)

## Goal

Perform a controlled major-dependency modernization in **strict sequence**, keeping the app functional at each step and avoiding broad refactors.

## Execution Rules (Mandatory)

1. Upgrade in the exact phase order below.
2. Apply one migration step at a time (no bulk major bumps).
3. After every step, pass the validation gate before continuing.
4. Keep changes minimal and localized to required break fixes.
5. If a step is blocked, stop, document blocker + options, and do not proceed to the next phase.

## Validation Gate (Run After Every Step)

Use this gate after each incremental version change:

1. Install and lock dependencies.
2. Build/compile succeeds.
3. App starts successfully (`npm: start - Editor`) with no new startup/runtime crashes.
4. Core smoke checks pass:
   - App window loads.
   - Main navigation works.
   - At least one representative editor flow (load/edit/save) works.
5. Unit tests run; failures caused by the upgrade are fixed.
6. Record what changed (deps + code/config + test status).

## Phased Upgrade Order

### Phase 1 — MUI Core: v5 → v6 → v7

Scope:

- `@mui/material`
- `@mui/system`
- `@mui/icons-material`
- Explicitly exclude `@mui/x-date-pickers` in this phase.

Sequence:

1. Upgrade MUI core packages from v5 to v6 and resolve breakages.
2. Pass validation gate.
3. Upgrade MUI core packages from v6 to v7 and resolve breakages.
4. Pass validation gate.

References:

- v5 → v6: https://mui.com/material-ui/migration/upgrade-to-v6/
- v6 → v7: https://mui.com/material-ui/migration/upgrade-to-v7/

### Phase 2 — MUI Pickers: v5 → v6 → v7 → v8

Scope:

- `@mui/x-date-pickers`

Sequence:

1. v5 → v6, resolve required API/provider/adapter changes.
2. Pass validation gate.
3. v6 → v7, resolve breakages.
4. Pass validation gate.
5. v7 → v8, resolve breakages.
6. Pass validation gate.

References:

- v5 → v6: https://mui.com/x/migration/migration-pickers-v5/
- v6 → v7: https://mui.com/x/migration/migration-pickers-v6/
- v7 → v8: https://mui.com/x/migration/migration-pickers-v7/

### Phase 3 — Electron Platform

Targets:

- `electron` → `40.6.1`
- Update Electron-adjacent dependencies to latest **compatible** versions.

Electron-adjacent packages to evaluate:

- `electron-builder`
- `electron-updater`
- `@electron/rebuild`
- `@electron/notarize`
- `electron-devtools-installer`
- `electron-debug`
- `electron-log`

Sequence:

1. Bump `electron` to `40.6.1`.
2. Apply breaking-change fixes in main/preload/renderer boundaries as required.
3. Upgrade Electron-adjacent packages one by one with validation gate per step.
4. Pass full validation gate after stack stabilizes.

References:

- Electron breaking changes: https://www.electronjs.org/docs/latest/breaking-changes
- `electron-builder`: https://github.com/electron-userland/electron-builder/releases
- `electron-updater`: https://www.electron.build/auto-update
- `@electron/rebuild`: https://github.com/electron/rebuild/releases
- `@electron/notarize`: https://github.com/electron/notarize/releases
- `electron-devtools-installer`: https://github.com/MarshallOfSound/electron-devtools-installer/releases
- `electron-debug`: https://github.com/sindresorhus/electron-debug/releases
- `electron-log`: https://github.com/megahertz/electron-log/tags

### Phase 4 — Remaining Major Upgrades (Controlled Batches)

Run these batches only after Phases 1–3 are stable.

#### 4A. React Stack

- `react` 18 → 19
- `react-dom` 18 → 19
- `react-test-renderer` 18 → 19
- `@types/react` 18 → 19
- `@types/react-dom` 18 → 19

References:

- https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- https://github.com/facebook/react/blob/main/CHANGELOG.md

#### 4B. Routing + State

- `react-router-dom` 6 → 7
- `@reduxjs/toolkit` 1 → 2
- `react-redux` 8 → 9

References:

- https://reactrouter.com/upgrading/v6
- https://redux-toolkit.js.org/usage/migrating-rtk-2

#### 4C. TypeScript + Linting

- `typescript` 4 → 5
- `eslint` 8 → 10 (or latest compatible major with the final stack)
- `@typescript-eslint/eslint-plugin` 5 → 8
- `@typescript-eslint/parser` 5 → 8

References:

- https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/
- https://github.com/microsoft/TypeScript/wiki/Breaking-Changes
- https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes
- https://eslint.org/docs/latest/use/migrate-to-9.0.0
- https://github.com/typescript-eslint/typescript-eslint/releases
- https://typescript-eslint.io/users/versioning

#### 4D. Testing Stack

- `jest` 29 → 30
- `jest-environment-jsdom` 29 → 30
- `@types/jest` 29 → 30
- `@testing-library/jest-dom` 5 → 6
- `@testing-library/react` 13 → 16

References:

- https://jestjs.io/docs/upgrading-to-jest30
- https://github.com/jestjs/jest/blob/main/CHANGELOG.md
- https://github.com/testing-library/react-testing-library/releases
- https://github.com/testing-library/jest-dom/releases

#### 4E. Build/Tooling

- `webpack-cli` 5 → 6
- `webpack-dev-server` 4 → 5
- `webpack-merge` 5 → 6
- `@svgr/webpack` 6 → 8
- `sass-loader` 13 → 16
- `css-loader` 6 → 7

References:

- https://github.com/webpack/webpack/releases
- https://github.com/webpack/webpack-dev-server/releases
- https://github.com/webpack/webpack-cli/releases
- https://github.com/survivejs/webpack-merge/tags
- https://react-svgr.com/docs/migrate/
- https://github.com/webpack/sass-loader/releases
- https://github.com/webpack/css-loader/releases

Execution rule for Phase 4:

- Within each batch (4A–4E), still upgrade incrementally and apply the validation gate after each meaningful step.

## Change Boundaries

Allowed:

- Dependency version changes.
- Required break-fix code/config updates.
- Test updates needed due to upstream API behavior changes.

Not allowed:

- Feature work.
- Unrelated refactors.
- Styling/architecture cleanup unrelated to the upgrade.

## Final Deliverables (Required)

At completion, provide:

1. **Dependency Change Summary**
   - Old → new version for every upgraded package.
2. **Breaking-Change Fix Log**
   - File-by-file summary of required code/config modifications.
3. **Validation Results**
   - Build status, app run status, smoke-check status, test results.
4. **Known Issues**
   - Remaining non-blocking problems and suggested next actions.

## Progress Report Template (Use Per Step)

- **Step:**
- **Packages changed:**
- **Docs reviewed:**
- **Code/config changes:**
- **Build result:**
- **App runtime result:**
- **Test result:**
- **Blockers/notes:**
- **Decision:** Proceed / Stop
