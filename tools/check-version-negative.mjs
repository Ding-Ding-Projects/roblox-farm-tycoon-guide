import { readFileSync } from "node:fs";
import { verifyVersionContract } from "./version-contract.mjs";

const release = JSON.parse(readFileSync(new URL("../release.json", import.meta.url), "utf8"));
const home = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const names = ["index", "Home", "Getting-Started", "Crops-and-Items", "Buildings-and-Production", "World-Lore", "Beta-Status"];
const wikiPages = names.map(name => [`wiki/${name}.html`, readFileSync(new URL(`../wiki/${name}.html`, import.meta.url), "utf8")]);
const baseline = { release, packageVersion: release.version, sourcePackageVersion: release.version, home, wikiPages };
verifyVersionContract(baseline);
let cases = 0;
function rejects(label, modified) {
  let failed = false;
  try { verifyVersionContract({ ...baseline, ...modified }); } catch { failed = true; }
  if (!failed) throw Error(`negative version check stayed green: ${label}`);
  cases += 1;
}
rejects("home marker", { home: home.replace('id="version-line"', 'id="removed-version"') });
rejects("home front placement", { home: home.replace('class="version-line front-version" id="version-line"', 'class="version-line" id="version-line"') });
rejects("home status semantics", { home: home.replace('id="version-line" role="status"', 'id="version-line"') });
for (const [path, html] of wikiPages) {
  rejects(`${path} marker`, { wikiPages: wikiPages.map(([name, value]) => [name, name === path ? html.replace('id="wiki-version"', 'id="removed-version"') : value]) });
}
rejects("wiki live announcement", { wikiPages: wikiPages.map(([name, value]) => [name, name === "wiki/index.html" ? value.replace('id="wiki-version" role="status" aria-live="polite"', 'id="wiki-version" role="status"') : value]) });
rejects("version", { release: { ...release, version: "" } });
rejects("build time", { release: { ...release, builtAtUtc: "" } });
rejects("source commit", { release: { ...release, sourceCommit: "" } });
rejects("source version", { sourcePackageVersion: "0.0.0" });
console.log(`Version boundary negative checks: ${cases} red mutations, baseline green.`);
