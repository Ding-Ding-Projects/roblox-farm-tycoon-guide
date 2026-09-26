# Farm Tycoon Field Guide

The [public guide](https://ding-ding-projects.github.io/roblox-farm-tycoon-guide/) explains the current farming catalogue, its costs and timings, original world lore, and the evidence boundary for each feature. It is a documentation and status site, not a playable copy of the Roblox experience. The [site-hosted wiki](https://ding-ding-projects.github.io/roblox-farm-tycoon-guide/wiki/) renders all six prepared reference pages. GitHub's separate repository wiki awaits its first-page initialization. Public beta publication is pending verified live play.

Build locally on Windows with `build.bat`. The site itself is dependency-free static HTML, CSS, and JavaScript. The one-click script requires Node.js only to record build provenance and check the catalogue inventory. The supported hosted path is GitHub Pages from `main` at `/`.

The original field-guide mark lives in `favicon.svg`. Home and every generated wiki page link it explicitly so browsers do not request a missing domain-root favicon. `tools/check.mjs` verifies the asset and all eight page links during the build.

Home searches catalogue cards and wiki articles. Every wiki route has a local full-guide search over the same reviewed source. The adjacent regex workbench uses the visitor's JavaScript engine for guided patterns, flags, sample matches and local snippets. [Search behavior and limitations](docs/guide/search.md) are documented separately. In the live 0.1.9 build, Home regex preview matched a short sample and a World Lore search for `建造時間` returned 14 building records. The other wiki routes still need their own rendered interaction checks.

The shared [language and appearance controls](docs/guide/language-and-appearance.md) offer English, Hong Kong Cantonese, bilingual, independent tone levels and device, light or dark appearance on Home and every site-hosted wiki route. Version 0.1.9 includes written Cantonese Home copy, catalogue descriptions and all six wiki article bodies. In the live build, Cantonese and dark appearance persisted after a Home reload, and the World Lore article switched its visible body, browser title and description. The static metadata served before scripts run remains English. The remaining routes and the wider interface contract need separate rendered checks.

![Verified Farm Tycoon barn interior](images/barn-dry-hay-entrance.png)

![Farm Tycoon field guide home at a 390 pixel mobile viewport](docs/captures/guide-home-mobile-0.1.6.png)

The guide image above is a genuine capture of the live 0.1.6 home page at a 390 by 844 emulated mobile viewport. The capture was recorded at `2026-09-26T07:24:18.790Z` (UTC) from Pages build `d04c4559400cb100dfa5078052f498ed562b55f7`. The [capture inventory](docs/capture-inventory.json) records its source and image hashes, interaction evidence, and privacy review. A mobile emulator is not a physical phone test.

![Farm Tycoon guide settings in Cantonese and dark appearance at a 390 pixel mobile viewport](docs/captures/guide-home-yue-dark-settings-0.1.9.png)

![Farm Tycoon World Lore article in Cantonese at a 390 pixel mobile viewport](docs/captures/guide-world-lore-yue-mobile-0.1.9.png)

The two 0.1.9 images are unedited captures from the live Pages build `d00d993aadcb5b23e67192258ff98b1fc79c9623`. The settings image was captured at `2026-09-26T09:11:56.841Z` (UTC) after a persisted-language reload; the World Lore image was captured at `2026-09-26T09:13:54.084Z` (UTC). Both use a 390 by 844 emulated mobile viewport. The [capture inventory](docs/capture-inventory.json) carries their exact hashes and privacy review. They do not establish behavior on a physical phone or every wiki route.

<details><summary>Catalogue and evidence</summary>

The public catalogue snapshot is in `catalogue.js`; it records 7 crops, 31 items, 4 animals, 13 recipes, 14 buildings, and 4 upgrades from private game source commit `163c8305694d8a25b453031b4bc54bc431af4642`. `Observed locally` means a selected route has real Studio evidence, not that every path or the public server was verified. `In development` means the source defines the entry but the full playable route lacks acceptance. The guide's `release.json` records the running guide version and build time.

The two site images are reviewed original game captures already published in the [Farm Tycoon gallery](https://ding-ding-projects.github.io/roblox-farm-tycoon-gallery/). The root `social-preview.png` is the same genuine barn capture, not a fabricated UI image.

</details>

<details><summary>Project records</summary>

- [Roadmap](ROADMAP.md)
- [Handoff](HANDOFF.md)
- [Guide feature article](docs/guide/catalogue.md)
- [World lore article](docs/guide/lore.md)

</details>
