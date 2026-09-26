import { formatGuideVersion } from "./version.js";
import { createSearchWorkbench } from "./search-workbench.js";
import { wikiPages } from "./search-index.js";
import { crops, animals, recipes, items, buildings, upgrades } from "./catalogue.js";
import { mountGuidePreferences, translated } from "./guide-preferences.js";

let getPreferences = () => ({ language: "en" });
const nav = document.querySelector(".wiki-nav");
const searchRegion = document.createElement("div"); searchRegion.className = "wiki-search"; searchRegion.setAttribute("role", "search");
const label = document.createElement("label"); label.htmlFor = "wiki-search"; label.textContent = "Search the full guide"; label.dataset.guideCopy = "fullSearch";
const input = document.createElement("input"); input.id = "wiki-search"; input.type = "search"; input.autocomplete = "off";
const results = document.createElement("div"); results.className = "search-results"; results.setAttribute("aria-live", "polite");
searchRegion.append(label, input, results); nav.before(searchRegion);
const allRecords = Object.entries({ crops, animals, recipes, items, buildings, upgrades }).flatMap(([category, values]) => values.map(entry => ({ title: entry.name, href: `../index.html#${category}-${entry.id}`, text: JSON.stringify(entry) })));
const workbench = createSearchWorkbench(input, renderSearch);
function renderSearch() {
  results.replaceChildren();
  if (!input.value.trim()) return;
  const found = [...wikiPages.map(page => ({ ...page, href: `../${page.href}` })), ...allRecords].filter(page => workbench.matcher(`${page.title} ${page.text}`));
  const status = document.createElement("p"); status.textContent = `${found.length} ${translated("guideResults", getPreferences().language)}`;
  const list = document.createElement("ul");
  for (const page of found.slice(0, 100)) { const item = document.createElement("li"); const link = document.createElement("a"); link.href = page.href; link.textContent = page.title; item.append(link); list.append(item); }
  results.append(status, list);
}

fetch("../release.json", { cache: "no-store" }).then(response => response.ok ? response.json() : Promise.reject()).then(release => {
  document.querySelector("#wiki-version").textContent = formatGuideVersion(release);
}).catch(() => {});
getPreferences = mountGuidePreferences(renderSearch);
