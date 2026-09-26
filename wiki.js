import { formatGuideVersion } from "./version.js";
import { createSearchWorkbench } from "./search-workbench.js";
import { wikiPages } from "./search-index.js";
import { crops, animals, recipes, items, buildings, upgrades } from "./catalogue.js";
import { mountGuidePreferences, translated } from "./guide-preferences.js";
import { nameYue, catalogueSearchYue } from "./catalogue-yue.js";

let getPreferences = () => ({ language: "en", englishFunny: 5, cantoneseFunny: 5 });
let releaseData = null;
const nav = document.querySelector(".wiki-nav");
const searchRegion = document.createElement("div"); searchRegion.className = "wiki-search"; searchRegion.setAttribute("role", "search");
const label = document.createElement("label"); label.htmlFor = "wiki-search"; label.textContent = "Search the full guide"; label.dataset.guideCopy = "fullSearch";
const input = document.createElement("input"); input.id = "wiki-search"; input.type = "search"; input.autocomplete = "off";
const results = document.createElement("div"); results.className = "search-results"; results.setAttribute("aria-live", "polite");
searchRegion.append(label, input, results); nav.before(searchRegion);
const allRecords = Object.entries({ crops, animals, recipes, items, buildings, upgrades }).flatMap(([category, values]) => values.map(entry => ({ title: entry.name, yueTitle: nameYue(entry.id), href: `../index.html#${category}-${entry.id}`, text: `${JSON.stringify(entry)} ${catalogueSearchYue(category, entry)}` })));
const workbench = createSearchWorkbench(input, renderSearch, () => getPreferences());
function renderSearch() {
  const preference = getPreferences();
  workbench.paint();
  const localizedLabel = (en, yue) => preference.language === "yue" ? yue : preference.language === "bilingual" ? `${en} · ${yue}` : en;
  const englishTitle = document.querySelector(".locale-en h1").textContent;
  const cantoneseTitle = document.querySelector(".locale-yue h1").textContent;
  document.title = localizedLabel(`${englishTitle} | Farm Tycoon Field Guide`, `${cantoneseTitle} | Farm Tycoon 農場指南`);
  document.querySelector('meta[name="description"]').content = localizedLabel(`Farm Tycoon field guide wiki: ${englishTitle}`, `Farm Tycoon 農場指南百科：${cantoneseTitle}`);
  document.querySelector(".topbar nav").setAttribute("aria-label", localizedLabel("Main navigation", "主導覽"));
  document.querySelector(".wiki-nav").setAttribute("aria-label", localizedLabel("Wiki pages", "百科文章"));
  document.querySelector("#wiki-version").textContent = formatGuideVersion(releaseData, { language: preference.language });
  document.querySelector(".locale-en").hidden = preference.language === "yue";
  document.querySelector(".locale-yue").hidden = preference.language === "en";
  const tone = document.querySelector(".wiki-tone") ?? document.createElement("p");
  tone.className = "wiki-tone";
  const english = ["This article keeps the same source facts.", "This article keeps the same source facts. Field notes in good order.", "This article keeps the same source facts. The scarecrow checked the labels.", "This article keeps the same source facts. The scarecrow brought a clipboard.", "This article keeps the same source facts. The scarecrow has taken charge of the filing desk."][preference.englishFunny - 1];
  const cantonese = ["本文嘅原始資料事實維持不變。", "本文嘅原始資料事實維持不變，田間筆記排好晒。", "本文嘅原始資料事實維持不變，稻草人都睇過標籤。", "本文嘅原始資料事實維持不變，稻草人攞埋寫字板。", "本文嘅原始資料事實維持不變，稻草人已經坐鎮檔案櫃。"][preference.cantoneseFunny - 1];
  tone.textContent = preference.language === "yue" ? cantonese : preference.language === "bilingual" ? `${english} ${cantonese}` : english;
  document.querySelector(".wiki-article").prepend(tone);
  results.replaceChildren();
  if (!input.value.trim()) return;
  const found = [...wikiPages.map(page => ({ ...page, href: `../${page.href}` })), ...allRecords].filter(page => workbench.matcher(`${page.title} ${page.yueTitle ?? ""} ${page.text}`));
  const status = document.createElement("p"); status.textContent = `${found.length} ${translated("guideResults", getPreferences().language)}`;
  const list = document.createElement("ul");
  for (const page of found.slice(0, 100)) { const item = document.createElement("li"); const link = document.createElement("a"); link.href = page.href; link.textContent = preference.language === "yue" ? page.yueTitle ?? page.title : preference.language === "bilingual" && page.yueTitle ? `${page.title} · ${page.yueTitle}` : page.title; item.append(link); list.append(item); }
  results.append(status, list);
}

fetch("../release.json", { cache: "no-store" }).then(response => response.ok ? response.json() : Promise.reject()).then(release => {
  releaseData = release; renderSearch();
}).catch(() => {});
getPreferences = mountGuidePreferences(renderSearch);
renderSearch();
