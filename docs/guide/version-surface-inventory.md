# Running version surface inventory

Every route below has its own visible version marker in the header before navigation. `release.json` supplies the guide version, UTC build time and source commit. `version.js` formats that time in the visitor's local timezone with seconds and an explicit timezone name; invalid or unavailable provenance leaves an honest unavailable label. The value is guide build provenance, not the time the visitor opened the page.

| Route | Marker | Runtime | Focused source check | Built interaction and capture |
| --- | --- | --- | --- | --- |
| `index.html` | `version-line` | `app.js` | `tools/check.mjs`, `tools/check-version-negative.mjs` | Pending a supported browser capture route |
| `wiki/index.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Home.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Getting-Started.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Crops-and-Items.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Buildings-and-Production.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/World-Lore.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |
| `wiki/Beta-Status.html` | `wiki-version` | `wiki.js` | Same checks | Pending a supported browser capture route |

The marker and fallback text are in each page's static HTML, so a network or script failure does not invent a date. The source checks verify the release record, the source commit's package version, local formatting with seconds and timezone, all eight front-screen markers, and deliberate red results after removing each marker or provenance field. This inventory covers the version feature only. It does not claim that the broader per-page feature inventory, language modes, localized copy, browser interaction or genuine captures are complete.
