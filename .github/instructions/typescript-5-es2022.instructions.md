---
description: 'Guidelines for TypeScript development in the Moonhaven Editor and SharedLibrary'
applyTo: '**/*.ts'
---

# TypeScript Development

> Two TypeScript projects exist in this repo with different compilation targets. Code conventions are shared, but module/target constraints differ.

## Project Targets

| Project       | Target  | Module   | Reason                                               |
| ------------- | ------- | -------- | ---------------------------------------------------- |
| SharedLibrary | **ES5** | CommonJS | Must run in Unity's Jint JS engine (ES5 only)        |
| Editor        | ES2021  | CommonJS | Electron + webpack toolchain, CommonJS module system |

**SharedLibrary ES5 constraint is strict.** Do not use ES6+ features (arrow functions in some contexts, `let`/`const` at runtime, `for...of`, `Map`/`Set`, `Promise`, `async/await`, template literals at runtime) unless TypeScript down-compiles them. Rely on the TypeScript compiler to handle transpilation — write modern TypeScript syntax, but be aware the output is ES5.

## Core Intent

- Respect the existing architecture and coding standards.
- Prefer readable, explicit solutions over clever shortcuts.
- Extend current abstractions before inventing new ones.
- Prioritize maintainability and clarity.

## Module System

- Both projects use **CommonJS** (`require`/`module.exports` in output).
- Write standard TypeScript `import`/`export` syntax — the compiler handles conversion.
- Do **not** use dynamic `import()` expressions in SharedLibrary (Jint doesn't support them).

## Naming & Style

- `PascalCase` for classes, interfaces, enums, and type aliases.
- `camelCase` for functions, variables, parameters, and object properties.
- No `I` prefix on interfaces — use descriptive names.
- `UPPER_SNAKE_CASE` for constants (matching the data file key convention).

## Formatting

- Run the repository's lint/format scripts before submitting.
- Match the project's indentation, quote style, and trailing comma rules.
- Keep functions focused; extract helpers when logic branches grow.

## Type System

- Avoid `any` (implicit or explicit); prefer `unknown` plus narrowing.
- Centralize shared type contracts in `SharedLibrary/src/interface.ts`.
- Use TypeScript utility types (`Readonly`, `Partial`, `Record`) to express intent.
- All data interfaces must stay in sync with the JSON data files in `StreamingAssets/data/`.

## SharedLibrary-Specific Rules

- `interface.ts` — TypeScript interfaces mirroring JSON data schemas exactly. Keep in sync with `Docs/data-schemas.md`.
- `constants.ts` — Enums and constant values. String constants use `UPPER_SNAKE_CASE`.
- `dataValidation.ts` — Validation rules (~4700 lines). All validation functions follow the `createAssert()` chainable pattern from `assert.util.ts`.
- `util/` — Pure utility functions. No side effects, no state.
- **Jint compatibility**: Avoid APIs not available in ES5 runtimes (e.g., `Symbol`, `WeakRef`, `globalThis`).

## Editor-Specific Rules

- React components in `Editor/src/renderer/components/`.
- Redux Toolkit store with 15 slices in `Editor/src/renderer/store/slices/`.
- Follow existing slice patterns for CRUD operations.
- MUI (Material UI 5.x) for UI components.
- Electron main process code in `Editor/src/main/`.

## Error Handling

- Guard edge cases early to avoid deep nesting.
- Use the project's assertion utilities (`assert.util.ts`) for validation errors.
- Surface validation errors through the `AllErrors` type structure.

## Testing

- SharedLibrary: Jest (`npm test` in `SharedLibrary/`).
- Test files in `SharedLibrary/src/__tests__/`.
- Follow existing test patterns and naming.

## Documentation

- Add JSDoc to public APIs; include `@remarks` or `@example` when helpful.
- Write comments that capture intent — remove stale notes during refactors.
