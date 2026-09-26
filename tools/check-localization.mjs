import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { crops, animals, recipes, buildings, items, upgrades } from "../catalogue.js";
import { homeCopyInventory } from "../home-yue.js";
import { names, notes, upgradeEffects, nameYue, quantityYue } from "../catalogue-yue.js";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const expected = ["Beta-Status.md", "Buildings-and-Production.md", "Crops-and-Items.md", "Getting-Started.md", "Home.md", "World-Lore.md"];
const list = readdirSync(new URL("wiki-source-yue/", root)).sort();
if (process.argv.includes("--negative")) list.pop();
assert.deepEqual(list, expected, "Every English wiki article needs a Cantonese counterpart");
for (const file of expected) {
  const en = read(`wiki-source/${file}`), yue = read(`wiki-source-yue/${file}`);
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
for (const page of expected) assert(read("search-index.js").includes(page.replace(/\.md$/, ".html")));
console.log(`Localization inventory passed: ${expected.length} wiki bodies, ${homeCopyInventory.length} Home targets, ${catalogue.length} catalogue records, ${items.length} items, ${upgrades.length} upgrades.`);
