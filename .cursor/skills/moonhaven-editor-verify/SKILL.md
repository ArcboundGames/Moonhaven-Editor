---
name: moonhaven-editor-verify
description: Verifies Moonhaven Electron Editor and SharedLibrary changes with type checks, lint, Jest, production builds, data validation, and companion Jint checks. Use after Editor or SharedLibrary changes.
---

# Verify Editor Changes

Run the smallest relevant checks during implementation:

```text
cd SharedLibrary && npm run check
cd ../Editor && npm run check
```

If SharedLibrary changed, run the sibling Moonhaven Jint freshness check.
If data/wiki code changed, run production data validation and offline wiki
checks against the sibling repository.

Finish with:

```text
node ../Moonhaven/tools/verify.mjs --scope shared,editor,scripts,data,wiki
```

Report companion SHA, checks, failures, and skipped scopes.
