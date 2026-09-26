import { readFileSync, existsSync } from "node:fs";
import { crops, animals, recipes, items, buildings, upgrades } from "../catalogue.js";
const groups = { crops, animals, recipes, items, buildings, upgrades };
const expected = { crops: 7, animals: 4, recipes: 13, items: 31, buildings: 14, upgrades: 4 };
for (const [name, entries] of Object.entries(groups)) {
  if (entries.length !== expected[name]) throw Error(`${name}: ${entries.length} entries, expected ${expected[name]}`);
  const ids = entries.map(entry => entry.id);
  if (new Set(ids).size !== ids.length) throw Error(`${name}: duplicate identifiers`);
  for (const entry of entries) if (!entry.name || !["observed", "development"].includes(entry.status)) throw Error(`${name}: incomplete ${entry.id}`);
}
for (const recipe of recipes) {
  if (!items.some(item => item.id === recipe.id)) throw Error(`recipe output missing item: ${recipe.id}`);
  if (!buildings.some(building => building.id === recipe.station.toLowerCase())) throw Error(`recipe station missing building: ${recipe.id}`);
}
const release = JSON.parse(readFileSync(new URL("../release.json", import.meta.url), "utf8"));
if (!release.version || !Number.isFinite(Date.parse(release.builtAtUtc)) || !/^[a-f0-9]{40}$/.test(release.sourceCommit)) throw Error("release provenance is invalid");
for (const path of ["index.html", "styles.css", "app.js", "social-preview.png", "images/barn-dry-hay-entrance.png", "images/arrival-reception-ccc0bd8.png"]) if (!existsSync(new URL(`../${path}`, import.meta.url))) throw Error(`site asset missing: ${path}`);
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
for (const marker of ['id="guide"', 'id="lore"', 'id="status"', 'property="og:image"', 'name="twitter:card"']) if (!html.includes(marker)) throw Error(`site route or metadata missing: ${marker}`);
console.log(`Guide inventory: ${Object.entries(groups).map(([name, list]) => `${list.length} ${name}`).join(", ")}.`);
