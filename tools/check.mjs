import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { crops, animals, recipes, items, buildings, upgrades } from "../catalogue.js";
import { verifyVersionContract } from "./version-contract.mjs";
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
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const sourcePackage = JSON.parse(execFileSync("git", ["show", `${release.sourceCommit}:package.json`], { encoding: "utf8" }));
const wikiVersionPaths = ["wiki/index.html", ...["Home", "Getting-Started", "Crops-and-Items", "Buildings-and-Production", "World-Lore", "Beta-Status"].map(name => `wiki/${name}.html`)];
verifyVersionContract({ release, packageVersion: pkg.version, sourcePackageVersion: sourcePackage.version,
  home: readFileSync(new URL("../index.html", import.meta.url), "utf8"),
  wikiPages: wikiVersionPaths.map(path => [path, readFileSync(new URL(`../${path}`, import.meta.url), "utf8")]),
});
for (const path of ["index.html", "styles.css", "app.js", "wiki.js", "wiki/index.html", "wiki/World-Lore.html", "wiki/Beta-Status.html", "social-preview.png", "images/barn-dry-hay-entrance.png", "images/arrival-reception-ccc0bd8.png"]) if (!existsSync(new URL(`../${path}`, import.meta.url))) throw Error(`site asset missing: ${path}`);
for (const name of ["Home", "Getting-Started", "Crops-and-Items", "Buildings-and-Production", "World-Lore", "Beta-Status"]) {
  const page = readFileSync(new URL(`../wiki/${name}.html`, import.meta.url), "utf8");
  if (!page.includes('property="og:image"') || !page.includes('id="wiki-version"')) throw Error(`wiki page incomplete: ${name}`);
}
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
for (const marker of ['id="guide"', 'id="systems"', 'id="lore"', 'id="status"', 'href="wiki/index.html"', 'property="og:image"', 'name="twitter:card"']) if (!html.includes(marker)) throw Error(`site route or metadata missing: ${marker}`);
console.log(`Guide inventory: ${Object.entries(groups).map(([name, list]) => `${list.length} ${name}`).join(", ")}.`);
