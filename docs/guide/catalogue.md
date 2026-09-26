# Catalogue behavior and verification

The guide enumerates every current `ContentDefinitions.lua` crop, item, animal, recipe, building, and upgrade. Cards show the recorded unlock, cost, input, output, yield, and current timer where each field applies. The source uses compact version-seven timers, calculated as `max(5, min(30, ceil(legacy_seconds / 10)))`; the guide displays that current result rather than the retained legacy duration.

`Observed locally` indicates that at least one relevant route has genuine selected-Studio evidence. It does not prove every rotation, account, device, or published-server route. `In development` indicates that a source definition exists but the complete earned and published behavior has not passed. Search and filters operate entirely in the visitor's browser. The site stores no personal catalogue query or profile data.

The catalogue must be updated whenever the private game definitions change. Review the public export, confirm no private model source or account data crossed the boundary, run `build.bat`, and update the source commit in the guide. A missing or newly added definition is a release blocker until the hand-written inventory and explanations agree.

**Verification:** `node tools/check.mjs` checks exact category counts, unique IDs, recipe outputs and stations, status labels, assets, and build provenance. The live page must also be checked in a browser at desktop and narrow widths.

**Suggested articles:** [World lore](lore.md), [guide index](README.md), and the [live field guide](https://ding-ding-projects.github.io/roblox-farm-tycoon-guide/).
