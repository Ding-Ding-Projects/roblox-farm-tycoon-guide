import { sourceCommit, crops, animals, recipes, items, buildings, upgrades } from "./catalogue.js";

const labels = { crops: "Crop and seed", items: "Item", animals: "Animal", recipes: "Recipe", buildings: "Building", upgrades: "Upgrade" };
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

function render() {
  const term = search.value.trim().toLocaleLowerCase();
  const subset = records.filter(entry => (category.value === "all" || entry.category === category.value) && (state.value === "all" || entry.status === state.value) && (!term || `${entry.name} ${entry.id} ${details(entry.category, entry).join(" ")}`.toLocaleLowerCase().includes(term)));
  cards.replaceChildren();
  const fragment = document.createDocumentFragment();
  for (const entry of subset) {
    const article = document.createElement("article"); article.className = "card"; article.id = `${entry.category}-${entry.id}`;
    const top = document.createElement("div"); top.className = "card-top";
    const label = document.createElement("span"); label.className = "type"; label.textContent = labels[entry.category];
    const status = document.createElement("span"); status.className = `badge ${entry.status}`; status.textContent = entry.status === "observed" ? "Observed locally" : "In development";
    top.append(label, status);
    const title = document.createElement("h3"); title.textContent = entry.name;
    const list = document.createElement("ul");
    for (const line of details(entry.category, entry)) { const li = document.createElement("li"); li.textContent = line; list.append(li); }
    article.append(top, title, list); fragment.append(article);
  }
  cards.append(fragment);
  count.textContent = `${subset.length} of ${records.length} entries shown`;
}

for (const control of [search, category, state]) control.addEventListener(control === search ? "input" : "change", render);
document.querySelector("#source-revision").textContent = sourceCommit;
fetch("release.json", { cache: "no-store" }).then(response => response.ok ? response.json() : Promise.reject()).then(release => {
  const stamp = new Date(release.builtAtUtc);
  if (!release.version || !Number.isFinite(stamp.getTime())) return;
  document.querySelector("#version-line").textContent = `Guide ${release.version} · Updated ${stamp.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "long" })}`;
}).catch(() => {});
render();
