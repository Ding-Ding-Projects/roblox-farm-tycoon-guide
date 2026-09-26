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

export function createTextMatcher(source, flags = "", regex = false) {
  if (!source) return { match: () => true, error: "" };
  if (!regex) return { match: text => text.toLocaleLowerCase().includes(source.toLocaleLowerCase()), error: "" };
  try {
    const expression = new RegExp(source, flags.replace(/[gyd]/g, ""));
    return { match: text => expression.test(text), error: "" };
  } catch (error) { return { match: () => false, error: error.message }; }
}

export function createSearchWorkbench(input, onChange) {
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
    const option = document.createElement("option"); option.value = token; option.textContent = `${name}: ${token}`;
    $("construct").append(option);
  }
  const readFlags = () => [...flagsNode.querySelectorAll("input:checked")].map(x => x.value).join("");
  let state = { regex: false, error: "", source: "", flags: "" };
  function compile() {
    state = { regex: regex.checked, error: "", source: regex.checked ? pattern.value : input.value, flags: readFlags() };
    state.error = createTextMatcher(state.source, state.flags, state.regex).error;
    validation.textContent = state.error || (state.regex ? `Valid pattern · flags ${state.flags || "none"}` : "Plain text mode");
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
      summary.textContent = `${found.length}${found.length === 100 ? "+" : ""} matches in ${(performance.now() - started).toFixed(2)} ms`;
      results.append(summary);
      const list = document.createElement("ol");
      for (const hit of found) {
        const item = document.createElement("li");
        item.textContent = `At ${hit.index}: ${JSON.stringify(hit[0])}; groups: ${JSON.stringify(hit.groups || hit.slice(1))}`;
        list.append(item);
      }
      results.append(list);
      if ($("replacement").value) {
        const replacement = document.createElement("p");
        replacement.textContent = `Replacement preview: ${sample.value.replace(new RegExp(state.source, state.flags.replace(/[gy]/g, "") + "g"), $("replacement").value).slice(0, 500)}`;
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
  $("import").addEventListener("change", async event => { const file = event.target.files[0]; if (!file || file.size > 20000) { validation.textContent = "Choose a JSON file under 20 KB."; return; } try { const data = JSON.parse(await file.text()); if (!Array.isArray(data) || data.length > 30 || data.some(x => typeof x.pattern !== "string" || x.pattern.length > 500 || typeof x.flags !== "string" || [...x.flags].some(f => !FLAGS.includes(f)))) throw Error("Invalid snippet file"); localStorage.setItem("farm-guide-regex-snippets", JSON.stringify(data)); snippetsRender(); validation.textContent = `${data.length} snippets imported.`; } catch { validation.textContent = "Invalid snippet file."; } });
  snippetsRender(); queueMicrotask(compile);
  return { matcher, get state() { return state; } };
}
