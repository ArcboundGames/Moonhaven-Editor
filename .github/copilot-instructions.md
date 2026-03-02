# Moonhaven-Editor — Copilot Instructions

## Project Context

Moonhaven-Editor is the companion tool for the **Moonhaven** game (a 2D multiplayer farming/survival/tower defense/RPG built in Unity). This repo contains:

1. **Editor** — An Electron + React + Redux desktop app for visually editing all game data.
2. **SharedLibrary** — A TypeScript library (interfaces, constants, validation, utilities) shared between the Editor and the Unity game (via Jint).

The **source of truth** for game design is `Moonhaven/Docs/`. Read those docs before making design-impacting changes.

## Repo Ownership

This repo **owns**:

- SharedLibrary: TypeScript schema definitions (`interface.ts`), constants (`constants.ts`), validation logic (`dataValidation.ts`), utilities (`util/`)
- Editor: Electron app, React UI, Redux store, data pipeline scripts
- Wiki content generation and upload (`Editor/src/wiki/`)
- Data integrity enforcement (validation is the gatekeeper for all data entering Unity)

This repo **does NOT own** (these live in the companion `Moonhaven` repo):

- Unity C# game code
- Shared JSON data files (authoritative storage is `Moonhaven/Moonhaven-Unity/Assets/StreamingAssets/data/`)
- Art/audio assets
- Game design documentation (`Moonhaven/Docs/`)
- Save data format
- Wiki server config and backups (`Moonhaven/Wiki/`)

## Cross-Repo Data Contract

The most critical invariant: **the shared JSON structure must stay synchronized across all consumers.** Any change to data file structure requires updates across:

| Consumer                 | Location                                    | What to update          |
| ------------------------ | ------------------------------------------- | ----------------------- |
| TypeScript interfaces    | `SharedLibrary/src/interface.ts`            | Type definitions        |
| TypeScript validation    | `SharedLibrary/src/dataValidation.ts`       | Validation rules        |
| TypeScript constants     | `SharedLibrary/src/constants.ts`            | Enum values, constants  |
| Editor Redux slices      | `Editor/src/renderer/store/slices/`         | State shape, reducers   |
| Editor UI components     | `Editor/src/renderer/components/`           | Input controls, display |
| Wiki generation          | `Editor/src/wiki/`                          | Content generation      |
| Unity C# deserialization | `Moonhaven/Moonhaven-Unity/Assets/Scripts/` | Data classes            |
| Documentation            | `Moonhaven/Docs/data-schemas.md`            | Schema documentation    |

**Schema drift is not acceptable.** The shared data schema is not versioned and has no migration path. Schema changes require a full data refresh; backward compatibility is not required.

## Change Checklist

Changes in this repo rarely exist in isolation. **Evaluate all 7 areas:**

1. **Unity code changes** — C# scripts in `Moonhaven/Moonhaven-Unity/Assets/Scripts/`. May need updates when data structures change.
2. **New art / sound assets** — Sprites, sounds in the main Moonhaven repo.
3. **Shared data changes** — JSON files in `Moonhaven/Moonhaven-Unity/Assets/StreamingAssets/data/`. Follow schemas in `Moonhaven/Docs/data-schemas.md` exactly.
4. **SharedLibrary code changes** — `SharedLibrary/src/`. Interfaces, constants, and validation must stay in sync with data file changes.
5. **Editor changes** — `Editor/src/`. UI components and Redux slices may need updates.
6. **Wiki generation changes** — `Editor/src/wiki/`. Scripts that generate and upload content to a MediaWiki site. (Server config and backups are in `Moonhaven/Wiki/`.)
7. **Game doc changes** — Update `Moonhaven/Docs/` to reflect any new or changed behavior.

> During the **planning phase**, explicitly list which areas are affected.

## Repo Structure

```
Editor/                         # Electron desktop app
  src/
    main/                       # Electron main process (file I/O, menus, IPC)
    renderer/                   # React frontend
      components/               # React components (one folder per data type)
      store/                    # Redux Toolkit store
        slices/                 # 15 Redux slices (one per data file / concern)
      middleware/               # Redux middleware
      util/                    # Frontend utilities
    scripts/                   # Data pipeline scripts
      combine-data.ts          # Merges split JSON → combined.json
      split-data.ts            # Splits combined.json → individual files
    wiki/                      # Wiki generation (wikiapi → MediaWiki)
  assets/                      # App icons and static assets
  output/                      # combined.json (all data merged for Editor use)

SharedLibrary/                 # Shared TypeScript library
  src/
    interface.ts               # TypeScript interfaces for all data types
    constants.ts               # Enums and constant values
    dataValidation.ts          # Validation rules (~4700 lines)
    util/                      # Utility modules
      assert.util.ts           # Assertion helpers
      combat.util.ts           # Combat calculations
      converters.util.ts       # Data converters (~1800 lines)
      creatureType.util.ts     # Creature type helpers
      itemType.util.ts         # Item type helpers
      localization.util.ts     # Localization key generators
      log.util.ts              # Logging utilities
      math.util.ts             # Math utilities
      null.util.ts             # Null/undefined helpers
      object.util.ts           # Generic object utilities
      objectType.util.ts       # Object type helpers
      record.util.ts           # Record/object utilities
      sprite.util.ts           # Sprite dimension/layout helpers
      string.util.ts           # String manipulation utilities
      time.util.ts             # Time/season calculation helpers
    __tests__/                 # Jest tests
```

## Architecture

### Editor (Electron + React)

- **Main process** (`Editor/src/main/`): File I/O, IPC bridge, window management.
- **Renderer process** (`Editor/src/renderer/`): React app with Redux Toolkit state management.
- **Data pipeline**: The Editor reads/writes JSON data files directly from/to `Moonhaven/Moonhaven-Unity/Assets/StreamingAssets/data/` via Electron's file system access.

### Redux Store

15 slices, one per data concern. Each slice manages CRUD for its data type:

| Slice             | Data File                |
| ----------------- | ------------------------ |
| `craftingRecipes` | `crafting_recipes.json`  |
| `creatures`       | `creatures.json`         |
| `data`            | Cross-cutting data state |
| `dialogue`        | `dialogue.json`          |
| `eventLogs`       | `events.json`            |
| `fishing`         | `fishing.json`           |
| `items`           | `items.json`             |
| `localizations`   | `localizations.json`     |
| `lootTables`      | `loot_tables.json`       |
| `objects`         | `objects.json`           |
| `player`          | `player.json`            |
| `quests`          | `quests.json`            |
| `skills`          | `skills.json`            |
| `world`           | `world.json`             |
| `worldZones`      | `world_zones.json`       |

### SharedLibrary

- **`interface.ts`**: TypeScript interfaces that mirror the JSON data file structures exactly.
- **`constants.ts`**: Enums and constant values used across both Editor and Unity (via Jint).
- **`dataValidation.ts`**: Comprehensive validation rules that run in both the Editor UI and Unity runtime.
- **`util/`**: Pure utility functions for combat math, data conversion, localization key generation, etc.

### Shared Validation Pipeline

SharedLibrary validation runs in two contexts:

1. **Editor**: Imported directly as a TypeScript dependency.
2. **Unity**: Bundled via `Moonhaven/Scripts/` webpack build → `app.js` → loaded by Unity's Jint (JS-in-.NET) runtime.

When changing validation rules, both contexts must be considered.

### Wiki Generation

`Editor/src/wiki/` contains scripts that:

- Read game data from the combined JSON
- Generate formatted wiki pages (crafting recipes, items, navigation)
- Upload to a MediaWiki site via the `wikiapi` npm package

## Code Conventions

- See `.github/instructions/typescript-5-es2022.instructions.md` for TypeScript style (covers both SharedLibrary and Editor targets)
- SharedLibrary targets ES5/CommonJS (for Jint compatibility)
- Editor targets ES2021/CommonJS with React JSX
- Use `PascalCase` for types/interfaces, `camelCase` for everything else
- No `I` prefix on interfaces
- Prefer `unknown` over `any`

## Testing

- SharedLibrary: Jest (`npm test` in `SharedLibrary/`)
- Editor: Electron test scripts
- CI: GitHub Actions — `editor.yml`, `shared-library.yml`

## Data File Schemas

All game data conforms to strict JSON schemas documented in `Moonhaven/Docs/data-schemas.md`. When adding fields:

1. Update `SharedLibrary/src/interface.ts` with the new field type
2. Update `SharedLibrary/src/dataValidation.ts` if validation is needed
3. Update `SharedLibrary/src/constants.ts` if new enums or constants are needed
4. Update the relevant Redux slice in `Editor/src/renderer/store/slices/`
5. Update the relevant Editor component to expose the field in the UI
6. Update `Moonhaven/Docs/data-schemas.md` to document the new field
7. Update Unity C# data classes in `Moonhaven/Moonhaven-Unity/Assets/Scripts/` to deserialize the new field
8. **Documentation updates in `Moonhaven/Docs/` are required on every PR without exception**

When removing or renaming fields, all 8 steps apply. Renaming is treated as remove + add.
