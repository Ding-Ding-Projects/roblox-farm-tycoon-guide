import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { crops, animals, recipes, buildings, items, upgrades } from "../catalogue.js";
import { homeCopyInventory } from "../home-yue.js";
import { names, notes, upgradeEffects, nameYue, quantityYue, catalogueSearchYue } from "../catalogue-yue.js";
import { formatGuideVersion } from "../version.js";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const expected = ["Beta-Status.md", "Buildings-and-Production.md", "Crops-and-Items.md", "Getting-Started.md", "Home.md", "World-Lore.md"];
const list = readdirSync(new URL("wiki-source-yue/", root)).sort();
if (process.argv.includes("--negative")) list.pop();
assert.deepEqual(list, expected, "Every English wiki article needs a Cantonese counterpart");
for (const file of expected) {
  const en = read(`wiki-source/${file}`).replace(/\r\n?/g, "\n");
  const yue = read(`wiki-source-yue/${file}`).replace(/\r\n?/g, "\n");
  assert.match(en, /^# /);
  assert.match(yue, /^# /);
  assert((yue.match(/[\u3400-\u9fff]/g) ?? []).length > 90, `${file} needs a complete written Cantonese body`);
  const route = file.replace(/\.md$/, ".html");
  const built = read(`wiki/${route}`);
  assert(built.includes('class="locale-en"') && built.includes('class="locale-yue"'), `${route} needs both bodies`);
  assert(built.includes(yue.split("\n")[0].slice(2)), `${route} lacks its Cantonese title`);
}
assert(homeCopyInventory.length >= 30, "Home content inventory lost a translated surface");
assert.equal(new Set(homeCopyInventory).size, homeCopyInventory.length, "Home content selectors must be unique");
const catalogue = [...crops, ...animals, ...recipes, ...buildings];
for (const entry of catalogue) {
  assert(nameYue(entry.id) !== entry.id || entry.id === "queue", `Missing Cantonese title: ${entry.id}`);
  for (const field of [entry.note, entry.availability]) if (field) assert(notes[field], `Missing Cantonese note: ${entry.id}`);
}
for (const entry of upgrades) assert(upgradeEffects[entry.effect], `Missing Cantonese upgrade effect: ${entry.id}`);
for (const item of items) assert(nameYue(item.id) !== item.name, `Missing Cantonese item name: ${item.id}`);
assert.equal(quantityYue("2 wheat + 1 corn"), "2 小麥 + 1 粟米", "Ingredient quantities and names must survive translation");
assert.match(catalogueSearchYue("crops", crops[0]), /種子價錢 2 金幣/);
assert.match(catalogueSearchYue("buildings", buildings[1]), /建造時間 20 秒/);
assert.match(read("wiki.js"), /catalogueSearchYue\(category, entry\)/);
assert.match(read("wiki.js"), /document\.title = localizedLabel/);
assert.match(read("search-workbench.js"), /\.builder-check"\)\.lastChild\.textContent/);
const release = { version: "1.2.3", sourceCommit: "a".repeat(40), builtAtUtc: "2026-09-26T08:00:00Z" };
const version = formatGuideVersion(release, { language: "bilingual", timeZone: "UTC" });
assert.match(version, /Guide 1\.2\.3 · Updated/);
assert.match(version, /指南 1\.2\.3 · 更新於/);
assert.equal((version.match(/UTC/g) ?? []).length, 4, "Both localized timestamps must retain the same timezone label and local-time note");
for (const page of expected) assert(read("search-index.js").includes(page.replace(/\.md$/, ".html")));
console.log(`Localization inventory passed: ${expected.length} wiki bodies, ${homeCopyInventory.length} Home targets, ${catalogue.length} catalogue records, ${items.length} items, ${upgrades.length} upgrades.`);
