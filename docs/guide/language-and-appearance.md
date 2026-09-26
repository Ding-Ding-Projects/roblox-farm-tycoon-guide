# Guide language and appearance preferences

Home and all seven site-hosted wiki URLs share a settings disclosure immediately after the header. It offers English, playful Hong Kong Cantonese, and bilingual display modes; separate English and Cantonese humor levels from 1 to 5; and light, dark, or device-following appearance. Both humor levels start at 5. The choices are stored per visitor in browser local storage under `farm-tycoon-guide-preferences-v1`. No account or network request is used for these preferences. If storage is unavailable or corrupt, the guide falls back to English, level 5 for each language, and the device appearance. Changing the device color preference updates an open page when appearance follows the device.

The current translation scope covers the settings controls and status, route navigation, main page headings, search labels and result counts, and catalogue type and evidence badges. The humor levels independently change the settings status copy in their respective languages. Detailed catalogue descriptions, most Home prose, wiki article bodies, search builder copy, image descriptions, and version wording still ship in English. This is a partial language surface and must not be represented as full page translation or complete compliance with the broader per-page interface contract. The chosen appearance applies to the shared guide surfaces, but per-element customization and import/export remain unimplemented.

The settings controls use native selects and range inputs, visible labels, keyboard interaction, and a status message. `node tools/check-preferences.mjs` checks storage validation, independent humor wording, color resolution, all eight HTML shells, and a deliberate missing-route regression. The normal catalogue and search source checks continue to run. Rendered interaction, narrow layout, assistive technology behavior, and visual parity still require the sanctioned hidden browser route; no new capture exists for this change.

## Remaining guide interface work

- Translate every article and detailed Home and catalogue paragraph without changing factual prices, levels, timers, evidence states, or source revision.
- Localize the search builder, image descriptions, version formatter, and all accessible names.
- Implement the remaining per-page settings, vocabulary upload, navigation, notifications, and other shared interface controls with their own verification.
- Capture and inspect Home and each wiki route in every language and appearance state using the supported hidden browser route.
