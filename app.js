import { sourceCommit, crops, animals, recipes, items, buildings, upgrades } from "./catalogue.js";
import { formatGuideVersion } from "./version.js";
import { createSearchWorkbench } from "./search-workbench.js";
import { wikiPages } from "./search-index.js";
import { mountGuidePreferences, translated } from "./guide-preferences.js";
import { nameYue, quantityYue, notes, upgradeEffects } from "./catalogue-yue.js";
import { paintHomeCopy } from "./home-yue.js";

let getPreferences = () => ({ language: "en", englishFunny: 5, cantoneseFunny: 5 });
let releaseData = null;

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
function detailsYue(category, entry) {
  const note = entry.note ? [notes[entry.note] ?? entry.note] : [];
  switch (category) {
    case "crops": return [`解鎖等級：${entry.level}`, `種子價錢：${entry.price} 金幣`, `目前生長時間：${pace(entry.seconds)} 秒`, `每次收成：${entry.yield} ${nameYue(entry.id)}，${entry.xp} XP`, ...note];
    case "animals": return [`解鎖等級：${entry.level}`, `買入價：${entry.purchase} 金幣`, `飼料：${nameYue(entry.feed)}`, `餵養後 ${pace(entry.seconds)} 秒可收集 ${entry.yield} ${nameYue(entry.product)}`, ...note];
    case "recipes": return [`工作站：${nameYue(entry.station)}`, `食譜解鎖等級：${entry.level}`, `原料：${quantityYue(entry.input)}`, `產出：${quantityYue(entry.output)}`, `目前製作時間：${pace(entry.seconds)} 秒`, ...(entry.availability ? [notes[entry.availability]] : [])];
    case "buildings": return [`解鎖等級：${entry.level}`, `成本：${entry.coins} 金幣，加 ${entry.materials === "None" ? "唔使材料" : quantityYue(entry.materials)}`, `目前建造時間：${pace(entry.seconds)} 秒`, ...note];
    case "upgrades": return [`最高級數：${entry.max}`, `每級成本：${entry.base} × 下一級級數，單位係金幣`, `效果：${upgradeEffects[entry.effect]}`, "升級必須經伺服器確認交易；單有資料定義唔代表公開版本已可使用。"];
    default: {
      const crop = crops.find(x => x.name.toLowerCase() === entry.id || x.seed.toLowerCase().replaceAll(" ", "_") === entry.id);
      const animal = animals.find(x => x.product.toLowerCase() === entry.id);
      const recipe = recipes.find(x => x.id === entry.id);
      const usesList = uses(entry.id).map(nameYue);
      let description;
      if (entry.kind === "seed") description = crop ? `喺自家空泥田種植前，以 ${crop.price} 金幣買一份種植用品。${nameYue(crop.id)}喺等級 ${crop.level} 解鎖，目前生長時間 ${pace(crop.seconds)} 秒。倉庫有位時，每次收成有 ${crop.yield} ${nameYue(crop.id)}同一份補充種植用品。` : "自家泥田嘅種植用品；買入同收成方法見農作物資料。";
      else if (entry.kind === "crop") description = crop ? `種落自家泥田後等 ${pace(crop.seconds)} 秒收成。每次可得 ${crop.yield} 份同 ${crop.xp} XP。` : "由自家泥田收成。";
      else if (entry.kind === "animal product") description = animal ? `用 ${nameYue(animal.feed)}餵自家嘅 ${nameYue(animal.id)}，等 ${pace(animal.seconds)} 秒後收集 ${animal.yield} 份。` : "由自家動物收集。";
      else description = recipe ? `喺 ${nameYue(recipe.station)}用 ${quantityYue(recipe.input)}製作 ${quantityYue(recipe.output)}；目前計時 ${pace(recipe.seconds)} 秒，食譜等級 ${recipe.level} 解鎖。工作站同原料都要先備妥。${recipe.availability ? notes[recipe.availability] : ""}` : "圖鑑入面嘅生產物品。";
      description += usesList.length ? ` 仲會用喺 ${usesList.join("、")}。` : " 收集後可以儲存或出售；有訂單時亦可以交付。";
      return [`定義價值：${entry.value} 金幣`, `類型：${({ seed: "種子或樹苗", crop: "農作物", "animal product": "動物產品", feed: "飼料", "made good": "加工貨品" })[entry.kind]}`, description];
    }
  }
}
const tones = {
  en: ["Catalogue facts follow the source.", "Catalogue facts follow the source. Nicely sorted.", "Catalogue facts follow the source. The labels have their boots on.", "Catalogue facts follow the source. Even the scarecrow can find its place.", "Catalogue facts follow the source. The scarecrow filed everything before breakfast."],
  yue: ["圖鑑資料跟返原始記錄。", "圖鑑資料跟返原始記錄，排得整整齊齊。", "圖鑑資料跟返原始記錄，標籤都企定定。", "圖鑑資料跟返原始記錄，稻草人都搵得到。", "圖鑑資料跟返原始記錄，稻草人朝早已經排好晒。"],
};

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
const workbench = createSearchWorkbench(search, render, () => getPreferences());

function render() {
  const preference = getPreferences();
  workbench.paint();
  paintHomeCopy(preference);
  document.querySelector("#version-line").textContent = formatGuideVersion(releaseData, { language: preference.language });
  const subset = records.filter(entry => (category.value === "all" || entry.category === category.value) && (state.value === "all" || entry.status === state.value) && workbench.matcher(`${entry.name} ${entry.id} ${details(entry.category, entry).join(" ")} ${nameYue(entry.id)} ${detailsYue(entry.category, entry).join(" ")}`));
  cards.replaceChildren();
  const fragment = document.createDocumentFragment();
  for (const entry of subset) {
    const article = document.createElement("article"); article.className = "card"; article.id = `${entry.category}-${entry.id}`;
    const top = document.createElement("div"); top.className = "card-top";
    const label = document.createElement("span"); label.className = "type"; label.textContent = translated(({ crops: "cropType", items: "itemType", animals: "animalType", recipes: "recipeType", buildings: "buildingType", upgrades: "upgradeType" })[entry.category], getPreferences().language);
    const status = document.createElement("span"); status.className = `badge ${entry.status}`; status.textContent = translated(entry.status === "observed" ? "observed" : "development", getPreferences().language);
    top.append(label, status);
    const title = document.createElement("h3");
    const titleYue = entry.category === "upgrades" ? `${nameYue(entry.id)}${entry.id === "queue" ? "" : entry.id === "land" ? "" : "容量"}` : nameYue(entry.id);
    title.textContent = preference.language === "yue" ? titleYue : preference.language === "bilingual" ? `${entry.name} · ${titleYue}` : entry.name;
    const list = document.createElement("ul");
    const english = details(entry.category, entry), cantonese = detailsYue(entry.category, entry);
    for (let i = 0; i < english.length; i++) { const li = document.createElement("li"); li.textContent = preference.language === "yue" ? cantonese[i] : preference.language === "bilingual" ? `${english[i]} · ${cantonese[i]}` : english[i]; list.append(li); }
    const tone = document.createElement("li"); tone.className = "card-tone"; tone.textContent = preference.language === "yue" ? tones.yue[preference.cantoneseFunny - 1] : preference.language === "bilingual" ? `${tones.en[preference.englishFunny - 1]} ${tones.yue[preference.cantoneseFunny - 1]}` : tones.en[preference.englishFunny - 1]; list.append(tone);
    article.append(top, title, list); fragment.append(article);
  }
  cards.append(fragment);
  count.textContent = `${subset.length} / ${records.length} ${translated("entriesShown", getPreferences().language)}`;
  wikiResults.replaceChildren();
  if (search.value.trim()) {
    const matches = wikiPages.filter(page => workbench.matcher(`${page.title} ${page.text}`));
    const heading = document.createElement("h3"); heading.textContent = `${matches.length} ${translated("pagesMatched", getPreferences().language)}`;
    const list = document.createElement("ul");
    for (const page of matches) { const li = document.createElement("li"); const a = document.createElement("a"); a.href = page.href; a.textContent = preference.language === "yue" ? page.yueTitle : preference.language === "bilingual" ? `${page.title} · ${page.yueTitle}` : page.title; li.append(a); list.append(li); }
    wikiResults.append(heading, list);
  }
}

for (const control of [search, category, state]) control.addEventListener(control === search ? "input" : "change", render);
document.querySelector("#source-revision").textContent = sourceCommit;
fetch("release.json", { cache: "no-store" }).then(response => response.ok ? response.json() : Promise.reject()).then(release => {
  releaseData = release; render();
}).catch(() => {});
getPreferences = mountGuidePreferences(render);
render();
