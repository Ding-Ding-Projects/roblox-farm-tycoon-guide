import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readPreferences, writePreferences, resolveAppearance, funnyMessage, translated } from "../guide-preferences.js";

const stored = new Map();
const storage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) };
assert.deepEqual(readPreferences(storage), { language: "en", englishFunny: 1, cantoneseFunny: 1, appearance: "system" });
writePreferences({ language: "yue", englishFunny: 5, cantoneseFunny: 2, appearance: "dark" }, storage);
assert.deepEqual(readPreferences(storage), { language: "yue", englishFunny: 5, cantoneseFunny: 2, appearance: "dark" });
writePreferences({ language: "unknown", englishFunny: 9, cantoneseFunny: -1, appearance: "unknown" }, storage);
assert.deepEqual(readPreferences(storage), { language: "en", englishFunny: 1, cantoneseFunny: 1, appearance: "system" });
stored.set("farm-tycoon-guide-preferences-v1", "{broken");
assert.equal(readPreferences(storage).language, "en");
assert.equal(resolveAppearance("system", true), "dark");
assert.equal(resolveAppearance("system", false), "light");
assert.equal(resolveAppearance("light", true), "light");
assert.equal(resolveAppearance("dark", false), "dark");
assert.notEqual(funnyMessage("en", 1, 5), funnyMessage("en", 5, 1));
assert.notEqual(funnyMessage("yue", 1, 1), funnyMessage("yue", 5, 5));
assert.match(translated("settings", "bilingual"), /Guide settings.*指南設定/);

const routes = ["index.html", "wiki/index.html", ...["Home", "Getting-Started", "Crops-and-Items", "Buildings-and-Production", "World-Lore", "Beta-Status"].map(name => `wiki/${name}.html`)];
function verifyRoutes(read) {
  for (const route of routes) {
    const html = read(route);
    assert.match(html, /href="(?:\.\.\/)?guide-preferences\.css"/, `${route}: preferences stylesheet`);
    assert.match(html, /data-guide-copy="(?:skipGuide|skipArticle)"/, `${route}: localized skip control`);
    assert.match(html, /src="(?:\.\.\/)?(?:app|wiki)\.js"/, `${route}: shared settings entry`);
  }
}
const read = route => readFileSync(new URL(`../${route}`, import.meta.url), "utf8");
verifyRoutes(read);
assert.throws(() => verifyRoutes(route => route === "wiki/index.html" ? read(route).replace('data-guide-copy="skipArticle"', "") : read(route)));
assert.match(read("app.js"), /mountGuidePreferences\(render\)/);
assert.match(read("wiki.js"), /mountGuidePreferences\(renderSearch\)/);
console.log("Guide preferences persistence, independent humor, appearance, and eight-route shell checks passed; deliberate route regression was rejected.");
