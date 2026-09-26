const KEY = "farm-tycoon-guide-preferences-v1";
const defaults = { language: "en", englishFunny: 5, cantoneseFunny: 5, appearance: "system" };
const choices = { language: ["en", "yue", "bilingual"], appearance: ["system", "light", "dark"] };

export function validatePreferences(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...defaults };
  const number = name => Number.isInteger(value[name]) && value[name] >= 1 && value[name] <= 5 ? value[name] : defaults[name];
  return {
    language: choices.language.includes(value.language) ? value.language : defaults.language,
    englishFunny: number("englishFunny"), cantoneseFunny: number("cantoneseFunny"),
    appearance: choices.appearance.includes(value.appearance) ? value.appearance : defaults.appearance,
  };
}

export function readPreferences(storage) {
  try { return validatePreferences(JSON.parse((storage ?? globalThis.localStorage).getItem(KEY))); }
  catch { return { ...defaults }; }
}

export function writePreferences(value, storage) {
  const safe = validatePreferences(value);
  try { (storage ?? globalThis.localStorage).setItem(KEY, JSON.stringify(safe)); } catch { /* The controls still work for this page when storage is unavailable. */ }
  return safe;
}

export function resolveAppearance(choice, systemDark) {
  return choice === "system" ? (systemDark ? "dark" : "light") : choice;
}

const copy = {
  settings: ["Guide settings", "指南設定"], language: ["Language", "語言"],
  en: ["English", "英文"], yue: ["Playful Hong Kong Cantonese", "趣味香港廣東話"], bilingual: ["English and Cantonese", "英文同廣東話"],
  englishFunny: ["English funny level", "英文幽默程度"], cantoneseFunny: ["Cantonese funny level", "廣東話幽默程度"],
  appearance: ["Appearance", "外觀"], system: ["Follow device", "跟隨裝置"], light: ["Light", "淺色"], dark: ["Dark", "深色"],
  home: ["Home", "主頁"], catalogue: ["Catalogue", "圖鑑"], how: ["How it works", "玩法說明"], lore: ["Lore", "世界故事"], beta: ["Beta status", "測試狀態"], wiki: ["Wiki", "百科"],
  getting: ["Getting started", "開始上手"], crops: ["Crops and items", "農作物同物品"], buildings: ["Buildings and production", "建築同生產"], world: ["World lore", "世界故事"],
  guideSearch: ["Search the guide", "搜尋指南"], fullSearch: ["Search the full guide", "搜尋整份指南"], category: ["Category", "類別"], evidence: ["Evidence", "證據"],
  allCategories: ["All categories", "全部類別"], allStatuses: ["All statuses", "全部狀態"], observed: ["Observed locally", "本機已觀察"], development: ["In development", "開發中"],
  heroEyebrow: ["An honest guide to a growing world", "一份老實講清楚嘅農場指南"], heroTitle: ["From first seed to a working town.", "由第一粒種子，慢慢起好一條村。"],
  heroButton: ["Explore the guide", "睇吓指南"], manual: ["The field manual", "農場手冊"], catalogueTitle: ["Everything in the current catalogue", "目前圖鑑入面嘅全部資料"],
  systemsEyebrow: ["Playing the farm", "經營農場"], systemsTitle: ["How the pieces fit together", "各樣嘢點樣連埋一齊"],
  loreEyebrow: ["Original world lore", "原創世界故事"], loreTitle: ["A town built one useful thing at a time", "一件件實用嘢，砌出一條村"],
  statusEyebrow: ["Release ledger", "推出進度"], statusTitle: ["Public beta is being prepared", "公開測試版準備緊"],
  backGuide: ["Back to the guide", "返去指南"], backTop: ["Back to top", "返去頂部"], skipGuide: ["Skip to guide", "跳到指南"], skipArticle: ["Skip to article", "跳到文章"],
  cropType: ["Crop and seed", "農作物同種子"], itemType: ["Item", "物品"], animalType: ["Animal", "動物"], recipeType: ["Recipe", "食譜"], buildingType: ["Building", "建築"], upgradeType: ["Upgrade", "升級"],
  entriesShown: ["entries shown", "項資料顯示中"], pagesMatched: ["wiki pages matched", "篇百科文章符合"], guideResults: ["guide results", "項指南結果"],
  coverage: ["Navigation and settings are translated. Detailed articles and catalogue descriptions currently remain in English.", "導覽同設定已有翻譯；詳細文章同圖鑑說明目前仍然係英文。"],
  funnyDefaults: ["Both funny levels start at 5. They style the settings message here; wider guide messages, errors, and warnings still need the same treatment.", "兩條幽默滑桿都由 5 開始。目前只會改呢度嘅設定訊息；其他指南訊息、錯誤同警告仲要補返。"],
};

export function translated(key, mode) {
  const pair = copy[key];
  if (!pair) return key;
  return mode === "yue" ? pair[1] : mode === "bilingual" ? `${pair[0]} · ${pair[1]}` : pair[0];
}

export function funnyMessage(language, englishFunny, cantoneseFunny) {
  const english = ["Preferences saved on this device.", "Preferences saved. Nice and tidy.", "Preferences saved. The guide remembered its manners.", "Preferences saved. Even the scarecrow took notes.", "Preferences saved. The scarecrow is now head of record keeping."][englishFunny - 1];
  const cantonese = ["設定已儲存在呢部裝置。", "設定儲好喇，整整齊齊。", "設定儲好喇，連稻草人都記得。", "設定儲好喇，稻草人仲攞埋筆記。", "設定儲好喇，稻草人話要做檔案主管。"][cantoneseFunny - 1];
  return language === "yue" ? cantonese : language === "bilingual" ? `${english} ${cantonese}` : english;
}

export function mountGuidePreferences(onChange = () => {}) {
  let state = readPreferences();
  const header = document.querySelector(".topbar");
  if (!header) return;
  const region = document.createElement("section");
  region.className = "guide-preferences";
  region.setAttribute("aria-label", "Guide settings");
  region.innerHTML = `<details><summary data-guide-copy="settings">Guide settings</summary><div class="guide-preference-grid"><label><span data-guide-copy="language">Language</span><select data-pref="language"><option value="en" data-guide-copy="en">English</option><option value="yue" data-guide-copy="yue">Playful Hong Kong Cantonese</option><option value="bilingual" data-guide-copy="bilingual">English and Cantonese</option></select></label><label><span data-guide-copy="englishFunny">English funny level</span><input data-pref="englishFunny" type="range" min="1" max="5" step="1"><output data-output="englishFunny"></output></label><label><span data-guide-copy="cantoneseFunny">Cantonese funny level</span><input data-pref="cantoneseFunny" type="range" min="1" max="5" step="1"><output data-output="cantoneseFunny"></output></label><label><span data-guide-copy="appearance">Appearance</span><select data-pref="appearance"><option value="system" data-guide-copy="system">Follow device</option><option value="light" data-guide-copy="light">Light</option><option value="dark" data-guide-copy="dark">Dark</option></select></label></div><p class="preference-status" role="status" aria-live="polite"></p><p class="preference-coverage" data-guide-copy="funnyDefaults">Both funny levels start at 5. They style the settings message here; wider guide messages, errors, and warnings still need the same treatment.</p><p class="preference-coverage" data-guide-copy="coverage">Navigation and settings are translated. Detailed articles and catalogue descriptions currently remain in English.</p></details>`;
  header.after(region);
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  const paint = () => {
    document.documentElement.dataset.theme = resolveAppearance(state.appearance, !!media?.matches);
    document.documentElement.lang = state.language === "yue" ? "yue-Hant-HK" : state.language === "bilingual" ? "en-HK" : "en";
    for (const element of document.querySelectorAll("[data-guide-copy]")) element.textContent = translated(element.dataset.guideCopy, state.language);
    for (const [key, value] of Object.entries(state)) {
      const control = region.querySelector(`[data-pref="${key}"]`);
      if (control) control.value = value;
      const output = region.querySelector(`[data-output="${key}"]`);
      if (output) output.value = String(value);
    }
    region.querySelector(".preference-status").textContent = funnyMessage(state.language, state.englishFunny, state.cantoneseFunny);
    onChange({ ...state });
  };
  region.addEventListener("input", event => {
    const name = event.target?.dataset.pref;
    if (!name) return;
    state = writePreferences({ ...state, [name]: name.endsWith("Funny") ? Number(event.target.value) : event.target.value });
    paint();
  });
  region.addEventListener("change", event => {
    if (event.target?.dataset.pref) paint();
  });
  media?.addEventListener?.("change", paint);
  window.addEventListener("storage", event => { if (event.key === KEY) { state = readPreferences(); paint(); } });
  paint();
  return () => ({ ...state });
}
