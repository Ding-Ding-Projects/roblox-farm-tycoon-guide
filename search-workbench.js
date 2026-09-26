// A local, per-field search and JavaScript RegExp workbench. No query leaves the browser.
const FLAGS = ["i", "m", "s", "u", "g", "y", "d", "v"];
const TOOLS = [
  ["Literal", "example"], ["Start", "^"], ["End", "$"], ["Word boundary", "\\b"],
  ["Digit", "\\d"], ["Unicode letter", "\\p{L}"], ["Character class", "[a-z]"],
  ["Capture", "(name)"], ["Named capture", "(?<name>value)"], ["Non-capture", "(?:one|two)"],
  ["Either", "one|two"], ["Optional", "?"], ["One or more", "+"],
  ["Lazy repeat", "+?"], ["Lookahead", "(?=next)"], ["Lookbehind", "(?<=before)"],
  ["Backreference", "\\1"]
];
const yue = {
  "Search guide": "搜尋指南", "Regex builder": "正規表示式工具", "JavaScript regular expression workbench": "JavaScript 正規表示式工具箱",
  "Plain text search is the default. Regex mode uses this browser's JavaScript RegExp engine. Patterns stay on this device.": "預設使用純文字搜尋。正規表示式模式會用呢個瀏覽器嘅 JavaScript RegExp 引擎。樣式只留喺呢部裝置。",
  "Use regular expression": "使用正規表示式", "Pattern": "樣式", "Flags": "旗標", "Insert construct": "插入結構", "Insert at cursor": "喺游標位置插入", "Test text": "測試文字", "Replacement template": "取代範本",
  "Engine support and safety": "引擎支援同安全提示", "Save snippet": "儲存片段", "Saved patterns": "已儲存樣式", "Copy pattern": "複製樣式", "Export snippets": "匯出片段", "Import snippets": "匯入片段", "Close builder": "關閉工具",
  "Literal": "原文", "Start": "開頭", "End": "結尾", "Word boundary": "字詞邊界", "Digit": "數字", "Unicode letter": "Unicode 字母", "Character class": "字元集合", "Capture": "擷取", "Named capture": "具名擷取", "Non-capture": "非擷取群組", "Either": "二選一", "Optional": "可選", "One or more": "一個或以上", "Lazy repeat": "最短重複", "Lookahead": "向前查看", "Lookbehind": "向後查看", "Backreference": "反向參照",
  "Supported by this browser: groups, lookarounds, backreferences, Unicode properties with u, and flags accepted by RegExp. Atomic groups, possessive quantifiers, conditionals, subroutines and inline modifiers are not supported by JavaScript RegExp. Set intersections and subtraction require a browser with the v flag. Long or nested patterns can run slowly; test only short, trusted samples. Timing is a measurement, not a safety guarantee. This engine does not expose a parse tree or step trace.": "呢個瀏覽器支援群組、前後查看、反向參照、配合 u 旗標嘅 Unicode 屬性，以及 RegExp 接受嘅旗標。JavaScript RegExp 唔支援原子群組、佔有式量詞、條件式、子程序或者行內修飾符。集合交集同差集要瀏覽器支援 v 旗標。長或者巢狀樣式可能運行得慢；只用短而可信嘅樣本測試。計時只係量度，唔係安全保證。呢個引擎唔會提供解析樹或者逐步追蹤。",
};

export function createTextMatcher(source, flags = "", regex = false) {
  if (!source) return { match: () => true, error: "" };
  if (!regex) return { match: text => text.toLocaleLowerCase().includes(source.toLocaleLowerCase()), error: "" };
  try {
    const expression = new RegExp(source, flags.replace(/[gyd]/g, ""));
    return { match: text => expression.test(text), error: "" };
  } catch (error) { return { match: () => false, error: error.message }; }
}

export function createSearchWorkbench(input, onChange, getPreferences = () => ({ language: "en" })) {
  const host = document.createElement("div");
  host.className = "search-workbench";
  input.parentNode.insertBefore(host, input);
  host.append(input);
  input.setAttribute("aria-label", input.getAttribute("aria-label") || "Search guide");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "search-builder-button";
  button.textContent = "Regex builder";
  button.setAttribute("aria-expanded", "false");
  host.append(button);
  const panel = document.createElement("section");
  panel.className = "search-builder";
  panel.hidden = true;
  panel.innerHTML = `<h3>JavaScript regular expression workbench</h3>
    <p>Plain text search is the default. Regex mode uses this browser's JavaScript RegExp engine. Patterns stay on this device.</p>
    <label class="builder-check"><input type="checkbox" data-role="regex"> Use regular expression</label>
    <label>Pattern <input data-role="pattern" type="text" autocomplete="off" spellcheck="false"></label>
    <fieldset><legend>Flags</legend><div class="builder-flags"></div></fieldset>
    <label>Insert construct <select data-role="construct"></select></label>
    <button type="button" data-role="insert">Insert at cursor</button>
    <label>Test text <textarea data-role="sample" rows="3" spellcheck="false"></textarea></label>
    <label>Replacement template <input data-role="replacement" type="text" spellcheck="false" placeholder="Use $&amp; or $&lt;name&gt;"></label>
    <p data-role="validation" role="status" aria-live="polite"></p>
    <div data-role="results" class="builder-results"></div>
    <details><summary>Engine support and safety</summary><p>Supported by this browser: groups, lookarounds, backreferences, Unicode properties with u, and flags accepted by RegExp. Atomic groups, possessive quantifiers, conditionals, subroutines and inline modifiers are not supported by JavaScript RegExp. Set intersections and subtraction require a browser with the v flag. Long or nested patterns can run slowly; test only short, trusted samples. Timing is a measurement, not a safety guarantee. This engine does not expose a parse tree or step trace.</p></details>
    <div class="builder-actions"><button type="button" data-role="save">Save snippet</button><select data-role="snippets" aria-label="Saved patterns"><option value="">Saved patterns</option></select><button type="button" data-role="copy">Copy pattern</button><button type="button" data-role="export">Export snippets</button><label class="import-label">Import snippets <input type="file" data-role="import" accept="application/json,.json"></label></div>
    <button type="button" data-role="close">Close builder</button>`;
  host.append(panel);
  const originals = [...panel.querySelectorAll("h3,p,summary,button,legend,label,option")].map(node => [node, node.firstChild?.nodeType === Node.TEXT_NODE ? node.firstChild.textContent : null]);
  const paint = () => {
    const mode = getPreferences().language;
    const local = (english) => mode === "yue" ? yue[english] ?? english : mode === "bilingual" ? `${english} · ${yue[english] ?? english}` : english;
    button.textContent = local("Regex builder");
    input.setAttribute("aria-label", local("Search guide"));
    $("replacement").placeholder = mode === "yue" ? "使用 $& 或 $<名稱>" : mode === "bilingual" ? "Use $& or $<name> · 使用 $& 或 $<名稱>" : "Use $& or $<name>";
    for (const [node, original] of originals) if (original !== null && node.firstChild) {
      const trimmed = original.trim();
      if (trimmed && yue[trimmed]) node.firstChild.textContent = original.replace(trimmed, local(trimmed));
    }
    for (const option of $("construct").options) {
      const name = option.dataset.name;
      if (name) option.textContent = `${local(name)}: ${option.value}`;
    }
  };
  const $ = role => panel.querySelector(`[data-role="${role}"]`);
  const regex = $("regex"), pattern = $("pattern"), sample = $("sample");
  const validation = $("validation"), results = $("results"), snippets = $("snippets");
  const flagsNode = panel.querySelector(".builder-flags");
  for (const flag of FLAGS) {
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox"; box.value = flag; box.checked = flag === "i";
    label.append(box, ` ${flag}`); flagsNode.append(label);
  }
  for (const [name, token] of TOOLS) {
    const option = document.createElement("option"); option.value = token; option.dataset.name = name; option.textContent = `${name}: ${token}`;
    $("construct").append(option);
  }
  const readFlags = () => [...flagsNode.querySelectorAll("input:checked")].map(x => x.value).join("");
  let state = { regex: false, error: "", source: "", flags: "" };
  function compile() {
    state = { regex: regex.checked, error: "", source: regex.checked ? pattern.value : input.value, flags: readFlags() };
    state.error = createTextMatcher(state.source, state.flags, state.regex).error;
    const mode = getPreferences().language;
    const en = state.regex ? `Valid pattern · flags ${state.flags || "none"}` : "Plain text mode";
    const cy = state.regex ? `樣式有效 · 旗標 ${state.flags || "無"}` : "純文字模式";
    validation.textContent = state.error || (mode === "yue" ? cy : mode === "bilingual" ? `${en} · ${cy}` : en);
    validation.classList.toggle("invalid", !!state.error);
    preview();
    onChange();
  }
  function preview() {
    results.replaceChildren();
    if (!state.regex || !state.source || state.error || !sample.value) return;
    const started = performance.now();
    const found = [];
    try {
      const scan = new RegExp(state.source, state.flags.replace(/[gy]/g, "") + "g");
      for (const hit of sample.value.matchAll(scan)) {
        found.push(hit);
        if (found.length >= 100) break;
      }
      const summary = document.createElement("p");
      const quantity = `${found.length}${found.length === 100 ? "+" : ""}`, elapsed = (performance.now() - started).toFixed(2);
      const en = `${quantity} matches in ${elapsed} ms`, cy = `${quantity} 個相符結果，耗時 ${elapsed} ms`;
      summary.textContent = getPreferences().language === "yue" ? cy : getPreferences().language === "bilingual" ? `${en} · ${cy}` : en;
      results.append(summary);
      const list = document.createElement("ol");
      for (const hit of found) {
        const item = document.createElement("li");
        const en = `At ${hit.index}: ${JSON.stringify(hit[0])}; groups: ${JSON.stringify(hit.groups || hit.slice(1))}`;
        const cy = `位置 ${hit.index}：${JSON.stringify(hit[0])}；群組：${JSON.stringify(hit.groups || hit.slice(1))}`;
        item.textContent = getPreferences().language === "yue" ? cy : getPreferences().language === "bilingual" ? `${en} · ${cy}` : en;
        list.append(item);
      }
      results.append(list);
      if ($("replacement").value) {
        const replacement = document.createElement("p");
        const value = sample.value.replace(new RegExp(state.source, state.flags.replace(/[gy]/g, "") + "g"), $("replacement").value).slice(0, 500);
        replacement.textContent = getPreferences().language === "yue" ? `取代預覽：${value}` : getPreferences().language === "bilingual" ? `Replacement preview: ${value} · 取代預覽：${value}` : `Replacement preview: ${value}`;
        results.append(replacement);
      }
    } catch (error) { results.textContent = error.message; }
  }
  function matcher(text) {
    return createTextMatcher(state.source, state.flags, state.regex).match(text);
  }
  function snippetsRead() {
    try { const x = JSON.parse(localStorage.getItem("farm-guide-regex-snippets") || "[]"); return Array.isArray(x) ? x.slice(0, 30) : []; }
    catch { return []; }
  }
  function snippetsRender() {
    snippets.length = 1;
    for (const entry of snippetsRead()) { const option = document.createElement("option"); option.value = entry.pattern; option.textContent = `${entry.pattern} /${entry.flags}`; snippets.append(option); }
  }
  button.addEventListener("click", () => { panel.hidden = !panel.hidden; button.setAttribute("aria-expanded", String(!panel.hidden)); if (!panel.hidden) { pattern.value ||= input.value; pattern.focus(); compile(); } });
  $("close").addEventListener("click", () => { panel.hidden = true; button.setAttribute("aria-expanded", "false"); input.focus(); });
  input.addEventListener("input", () => { if (regex.checked) pattern.value = input.value; compile(); });
  pattern.addEventListener("input", () => { if (regex.checked) input.value = pattern.value; compile(); });
  regex.addEventListener("change", () => { if (regex.checked) pattern.value = input.value; else input.value = pattern.value; compile(); });
  flagsNode.addEventListener("change", compile);
  sample.addEventListener("input", preview);
  $("replacement").addEventListener("input", preview);
  $("insert").addEventListener("click", () => { const start = pattern.selectionStart; pattern.setRangeText($("construct").value, start, pattern.selectionEnd, "end"); if (regex.checked) input.value = pattern.value; pattern.focus(); compile(); });
  $("save").addEventListener("click", () => { if (!pattern.value) return; const entries = snippetsRead().filter(x => x.pattern !== pattern.value); entries.unshift({ pattern: pattern.value, flags: readFlags() }); localStorage.setItem("farm-guide-regex-snippets", JSON.stringify(entries.slice(0, 30))); snippetsRender(); });
  snippets.addEventListener("change", () => { const entry = snippetsRead().find(x => x.pattern === snippets.value); if (!entry) return; regex.checked = true; pattern.value = input.value = entry.pattern; for (const box of flagsNode.querySelectorAll("input")) box.checked = entry.flags.includes(box.value); compile(); });
  $("copy").addEventListener("click", () => navigator.clipboard?.writeText(`/${pattern.value}/${readFlags()}`));
  $("export").addEventListener("click", () => { const blob = new Blob([JSON.stringify(snippetsRead(), null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "guide-regex-snippets.json"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); });
  $("import").addEventListener("change", async event => { const file = event.target.files[0]; const language = getPreferences().language; const message = (en, cy) => language === "yue" ? cy : language === "bilingual" ? `${en} · ${cy}` : en; if (!file || file.size > 20000) { validation.textContent = message("Choose a JSON file under 20 KB.", "請揀細過 20 KB 嘅 JSON 檔案。"); return; } try { const data = JSON.parse(await file.text()); if (!Array.isArray(data) || data.length > 30 || data.some(x => typeof x.pattern !== "string" || x.pattern.length > 500 || typeof x.flags !== "string" || [...x.flags].some(f => !FLAGS.includes(f)))) throw Error("Invalid snippet file"); localStorage.setItem("farm-guide-regex-snippets", JSON.stringify(data)); snippetsRender(); validation.textContent = message(`${data.length} snippets imported.`, `已匯入 ${data.length} 個片段。`); } catch { validation.textContent = message("Invalid snippet file.", "片段檔案格式無效。"); } });
  snippetsRender(); queueMicrotask(compile);
  paint();
  return { matcher, paint, get state() { return state; } };
}
