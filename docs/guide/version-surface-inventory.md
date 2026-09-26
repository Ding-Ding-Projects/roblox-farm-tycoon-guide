# Running version surface inventory

Every route below has its own visible version marker in the header before navigation. `release.json` supplies the guide version, UTC build time and source commit. `version.js` formats that time in the visitor's local timezone with seconds and an explicit timezone name; invalid or unavailable provenance leaves an honest unavailable label. The value is guide build provenance, not the time the visitor opened the page.

| Route | Marker | Runtime | Focused source check | Built interaction and capture |
| --- | --- | --- | --- | --- |
| `index.html` | `version-line` | `app.js` | `tools/check.mjs`, `tools/check-version-negative.mjs` | Live 0.1.6 Home at 390 by 844 emulated mobile, with version before navigation, no body overflow, named controls, visible keyboard focus, and zero observed console or network errors. [Inspected capture](../captures/guide-home-mobile-0.1.6.png) and [inventory](../capture-inventory.json). |
| `wiki/index.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Home.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Getting-Started.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Crops-and-Items.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Buildings-and-Production.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/World-Lore.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Beta-Status.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |

The marker and fallback text are in each page's static HTML, so a network or script failure does not invent a date. The source checks verify the release record, the source commit's package version, local formatting with seconds and timezone, all eight front-screen markers, and deliberate red results after removing each marker or provenance field. The Home capture was recorded at `2026-09-26T07:24:18.790Z` (UTC) from the built `d04c4559400cb100dfa5078052f498ed562b55f7` revision. The other seven routes still need their own built interaction and capture proof. This inventory covers the version feature only; the broader per-page feature inventory, language modes, and localized copy remain open.
