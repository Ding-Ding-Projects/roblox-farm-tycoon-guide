import { sourceCommit, crops, animals, recipes, items, buildings, upgrades } from "./catalogue.js";
import { formatGuideVersion } from "./version.js";
import { createSearchWorkbench } from "./search-workbench.js";
import { wikiPages } from "./search-index.js";
import { mountGuidePreferences, translated } from "./guide-preferences.js";

let getPreferences = () => ({ language: "en" });

const pace = seconds => Math.max(5, Math.min(30, Math.ceil(seconds / 10)));
const cropById = new Map(crops.map(x => [x.id, x]));
const animalByProduct = new Map(animals.map(x => [x.product.toLowerCase(), x]));
const recipeByOutput = new Map(recipes.map(x => [x.id, x]));
const uses = id => recipes.filter(x => x.input.split(/\s*\+\s*/).some(part => part.trim().endsWith(` ${id}`))).map(x => x.name);

function itemDescription(item) {
  const id = item.id;
  if (item.kind === "seed") {
    const crop = crops.find(x => x.seed.toLowerCase().replaceAll(" ", "_") === id);
    return crop ? `Buy this planting supply for ${crop.price} coins and use one on an empty owned soil bed. ${crop.name} unlocks at level ${crop.level}; its current growth timer is ${pace(crop.seconds)} seconds. Harvesting returns ${crop.yield} ${crop.name.toLowerCase()} and one planting supply, subject to available storage.` : "A planting supply for an owned soil bed. Its exact purchase and harvest route is described in the crop entry.";
  }
  if (item.kind === "crop") {
    const crop = crops.find(x => x.name.toLowerCase() === id);
    const made = uses(id);
    return `${crop ? `Harvest ${crop.name.toLowerCase()} from its planted bed after ${pace(crop.seconds)} seconds. Each harvest yields ${crop.yield} and ${crop.xp} XP.` : "Harvest this from an owned crop bed."} ${made.length ? `It is used in ${made.join(", ")}.` : "It can be stored or sold."}`;
  }
  if (item.kind === "animal product") {
    const animal = animalByProduct.get(id);
    const made = uses(id);
    return `${animal ? `Feed an owned ${animal.name.toLowerCase()} with ${animal.feed.toLowerCase()}, then collect ${animal.yield} after its ${pace(animal.seconds)}-second timer.` : "Collect this from an owned animal."} ${made.length ? `It is used in ${made.join(", ")}.` : "It can be stored or sold."}`;
  }
  const recipe = recipeByOutput.get(id);
  const made = uses(id);
  return `${recipe ? `Produce ${recipe.output} at the ${recipe.station.toLowerCase()} from ${recipe.input}; the current production timer is ${pace(recipe.seconds)} seconds and the recipe rule unlocks at level ${recipe.level}. The station and ingredients must also be available.${recipe.availability ? ` ${recipe.availability}` : ""}` : "This item is part of the production catalogue."} ${made.length ? `It is also used in ${made.join(", ")}.` : "Once collected, it can be stored, sold, or used in an order when offered."}`;
}

function details(category, entry) {
  switch (category) {
    case "crops": return [`Unlock: level ${entry.level}`, `Seed price: ${entry.price} coins`, `Current growth: ${pace(entry.seconds)} seconds`, `Harvest: ${entry.yield} + ${entry.xp} XP`, entry.note];
    case "animals": return [`Unlock: level ${entry.level}`, `Purchase: ${entry.purchase} coins`, `Feed: ${entry.feed}`, `Collect: ${entry.yield} ${entry.product.toLowerCase()} after ${pace(entry.seconds)} seconds`, entry.note];
    case "recipes": return [`Station: ${entry.station}`, `Recipe unlock: level ${entry.level}`, `Inputs: ${entry.input}`, `Output: ${entry.output}`, `Current timer: ${pace(entry.seconds)} seconds`, ...(entry.availability ? [entry.availability] : [])];
    case "buildings": return [`Unlock: level ${entry.level}`, `Cost: ${entry.coins} coins + ${entry.materials.toLowerCase()}`, `Current build timer: ${pace(entry.seconds)} seconds`, entry.note];
    case "upgrades": return [`Maximum tier: ${entry.max}`, `Tier cost: ${entry.base} × next tier coins`, `Effect: ${entry.effect}`, "Apply an upgrade through an authoritative transaction; a definition alone does not prove published availability."];
    default: return [`Definition value: ${entry.value} coins`, `Type: ${entry.kind}`, itemDescription(entry)];
  }
}

const records = Object.entries({ crops, items, animals, recipes, buildings, upgrades }).flatMap(([category, entries]) => entries.map(entry => ({ category, ...entry })));
const cards = document.querySelector("#cards");
const search = document.querySelector("#search");
const category = document.querySelector("#category");
const state = document.querySelector("#state");
const count = document.querySelector("#result-count");
const wikiResults = document.createElement("div");
wikiResults.className = "search-results";
wikiResults.setAttribute("aria-live", "polite");
count.after(wikiResults);
const workbench = createSearchWorkbench(search, render);

function render() {
  const subset = records.filter(entry => (category.value === "all" || entry.category === category.value) && (state.value === "all" || entry.status === state.value) && workbench.matcher(`${entry.name} ${entry.id} ${details(entry.category, entry).join(" ")}`));
  cards.replaceChildren();
  const fragment = document.createDocumentFragment();
  for (const entry of subset) {
    const article = document.createElement("article"); article.className = "card"; article.id = `${entry.category}-${entry.id}`;
    const top = document.createElement("div"); top.className = "card-top";
    const label = document.createElement("span"); label.className = "type"; label.textContent = translated(({ crops: "cropType", items: "itemType", animals: "animalType", recipes: "recipeType", buildings: "buildingType", upgrades: "upgradeType" })[entry.category], getPreferences().language);
    const status = document.createElement("span"); status.className = `badge ${entry.status}`; status.textContent = translated(entry.status === "observed" ? "observed" : "development", getPreferences().language);
    top.append(label, status);
    const title = document.createElement("h3"); title.textContent = entry.name;
    const list = document.createElement("ul");
    for (const line of details(entry.category, entry)) { const li = document.createElement("li"); li.textContent = line; list.append(li); }
    article.append(top, title, list); fragment.append(article);
  }
  cards.append(fragment);
  count.textContent = `${subset.length} / ${records.length} ${translated("entriesShown", getPreferences().language)}`;
  wikiResults.replaceChildren();
  if (search.value.trim()) {
    const matches = wikiPages.filter(page => workbench.matcher(`${page.title} ${page.text}`));
    const heading = document.createElement("h3"); heading.textContent = `${matches.length} ${translated("pagesMatched", getPreferences().language)}`;
    const list = document.createElement("ul");
    for (const page of matches) { const li = document.createElement("li"); const a = document.createElement("a"); a.href = page.href; a.textContent = page.title; li.append(a); list.append(li); }
    wikiResults.append(heading, list);
  }
}

for (const control of [search, category, state]) control.addEventListener(control === search ? "input" : "change", render);
document.querySelector("#source-revision").textContent = sourceCommit;
fetch("release.json", { cache: "no-store" }).then(response => response.ok ? response.json() : Promise.reject()).then(release => {
  document.querySelector("#version-line").textContent = formatGuideVersion(release);
}).catch(() => {});
getPreferences = mountGuidePreferences(render);
render();
