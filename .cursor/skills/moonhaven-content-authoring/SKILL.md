---
name: moonhaven-content-authoring
description: Routes Moonhaven-Editor content requests to the sibling Moonhaven content-authoring skills and shared validator. Use for items, creatures, objects, recipes, loot, dialogue, events, quests, skills, zones, settings, localization, art, or wiki updates.
---

# Moonhaven Content Authoring

The authoritative skills and production data live in the sibling repository.

1. Require `../Moonhaven`.
2. Read `../Moonhaven/.cursor/skills/moonhaven-add-content/SKILL.md`.
3. Invoke the focused sibling specialist for the requested content type.
4. Use Editor/SharedLibrary only through the shared content registry,
   validation, wiki build, asset staging, and publishing boundaries.
5. Report both repository SHAs and all companion changes.
