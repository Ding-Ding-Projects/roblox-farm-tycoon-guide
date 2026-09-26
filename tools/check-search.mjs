import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createTextMatcher } from "../search-workbench.js";
import { wikiPages } from "../search-index.js";

const pages = ["Home", "Getting-Started", "Crops-and-Items", "Buildings-and-Production", "World-Lore", "Beta-Status"];
assert.equal(wikiPages.length, pages.length);
for (const name of pages) {
  assert(wikiPages.some(page => page.href === `wiki/${name}.html`));
  const html = readFileSync(new URL(`../wiki/${name}.html`, import.meta.url), "utf8");
  assert.match(html, /src="\.\.\/wiki\.js"/);
}
assert.match(readFileSync(new URL("../wiki/index.html", import.meta.url), "utf8"), /src="\.\.\/wiki\.js"/);
assert.match(readFileSync(new URL("../index.html", import.meta.url), "utf8"), /id="search"/);
assert.match(readFileSync(new URL("../app.js", import.meta.url), "utf8"), /createSearchWorkbench\(search, render\)/);
assert.match(readFileSync(new URL("../wiki.js", import.meta.url), "utf8"), /createSearchWorkbench\(input, renderSearch\)/);
assert(createTextMatcher("WHEAT").match("Golden wheat"));
assert(!createTextMatcher("wheat").match("Sheep wool"));
assert(createTextMatcher("^wheat\\b", "i", true).match("Wheat grows"));
assert(!createTextMatcher("^wheat\\b", "i", true).match("Winter wheat"));
assert(createTextMatcher("[", "", true).error);
assert(!createTextMatcher("[", "", true).match("anything"));
assert(createTextMatcher("wheat", "g", true).match("wheat wheat"));
assert(createTextMatcher("wheat", "g", true).match("wheat wheat"));
console.log("Search inventory and matcher checks passed for Home and seven wiki routes.");
