import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, join } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = join(root, "wiki-source");
const output = join(root, "wiki");
const files = readdirSync(source).filter(name => name.endsWith(".md")).sort();
const expected = ["Beta-Status.md", "Buildings-and-Production.md", "Crops-and-Items.md", "Getting-Started.md", "Home.md", "World-Lore.md"];
if (JSON.stringify(files) !== JSON.stringify(expected)) throw Error("Wiki page inventory changed; review it before publishing");

const escape = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function inline(text) {
  let result = escape(text);
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const href = url.endsWith(".md") && !url.includes("/") ? url.slice(0, -3) + ".html" : url;
    if (!(href.startsWith("https://") || /^[A-Za-z0-9-]+\.html$/.test(href))) throw Error(`Unsafe wiki link: ${href}`);
    return `<a href="${escape(href)}">${label}</a>`;
  });
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return result;
}
function renderMarkdown(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  let html = "", paragraph = [], list = false;
  const flush = () => { if (paragraph.length) { html += `<p>${inline(paragraph.join(" "))}</p>\n`; paragraph = []; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); if (list) { html += "</ul>\n"; list = false; } continue; }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) { flush(); if (list) { html += "</ul>\n"; list = false; } const level = heading[1].length; html += `<h${level}>${inline(heading[2])}</h${level}>\n`; continue; }
    const bullet = /^-\s+(.+)$/.exec(line);
    if (bullet) { flush(); if (!list) { html += "<ul>\n"; list = true; } html += `<li>${inline(bullet[1])}</li>\n`; continue; }
    if (list) { html += "</ul>\n"; list = false; }
    paragraph.push(line);
  }
  flush(); if (list) html += "</ul>\n";
  return html;
}

mkdirSync(output, { recursive: true });
const nav = [
  ["Home.html", "Home", "home"], ["Getting-Started.html", "Getting started", "getting"], ["Crops-and-Items.html", "Crops and items", "crops"],
  ["Buildings-and-Production.html", "Buildings and production", "buildings"], ["World-Lore.html", "World lore", "world"], ["Beta-Status.html", "Beta status", "beta"],
];
const searchPages = [];
for (const file of files) {
  const markdown = readFileSync(join(source, file), "utf8").replace(/\r\n?/g, "\n");
  const title = /^#\s+(.+)$/m.exec(markdown)?.[1];
  if (!title) throw Error(`Wiki title missing: ${file}`);
  const body = renderMarkdown(markdown);
  searchPages.push({ title, href: `wiki/${file.replace(/\.md$/, ".html")}`, text: markdown.replace(/[#*`\[\]()]/g, " ").slice(0, 30000) });
  const links = nav.map(([href, label, key]) => `<a href="${href}" data-guide-copy="${key}"${file.replace(/\.md$/, ".html") === href ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const page = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#123c32"><meta name="description" content="Farm Tycoon field guide wiki: ${escape(title)}"><title>${escape(title)} | Farm Tycoon Field Guide</title><link rel="stylesheet" href="../styles.css"></head><body><a class="skip" href="#wiki-main">Skip to article</a><header class="topbar"><a class="brand" href="../index.html"><span class="brand-mark" aria-hidden="true">✦</span><span>Farm Tycoon<br><small>Field Guide</small></span></a><nav aria-label="Main navigation"><a href="../index.html#guide">Catalogue</a><a href="../index.html#systems">How it works</a><a href="../index.html#lore">Lore</a><a href="../index.html#status">Beta status</a></nav></header><main id="wiki-main" class="wiki-layout"><nav class="wiki-nav" aria-label="Wiki pages">${links}</nav><article class="wiki-article">${body}<p class="version-line" id="wiki-version">Guide version unavailable · Updated time unavailable</p></article></main><footer><span>Farm Tycoon Field Guide</span><a href="../index.html">Back to the guide</a></footer><script type="module" src="../wiki.js"></script></body></html>\n`;
  const oldVersion = '<p class="version-line" id="wiki-version">Guide version unavailable · Updated time unavailable</p>';
  const mainNav = '<nav aria-label="Main navigation">';
  if (page.split(oldVersion).length !== 2 || page.split(mainNav).length !== 2) throw Error(`Wiki shell markers changed: ${file}`);
  const frontPage = page.replace(oldVersion, "")
    .replace(mainNav, `<p class="version-line front-version" id="wiki-version" role="status" aria-live="polite">Guide version unavailable · Updated time unavailable</p>${mainNav}`)
    .replace('<link rel="stylesheet" href="../styles.css">', '<link rel="icon" type="image/svg+xml" href="../favicon.svg"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../guide-preferences.css">')
    .replace('href="#wiki-main">Skip to article</a>', 'href="#wiki-main" data-guide-copy="skipArticle">Skip to article</a>')
    .replace('href="../index.html#guide">Catalogue</a>', 'href="../index.html#guide" data-guide-copy="catalogue">Catalogue</a>')
    .replace('href="../index.html#systems">How it works</a>', 'href="../index.html#systems" data-guide-copy="how">How it works</a>')
    .replace('href="../index.html#lore">Lore</a>', 'href="../index.html#lore" data-guide-copy="lore">Lore</a>')
    .replace('href="../index.html#status">Beta status</a>', 'href="../index.html#status" data-guide-copy="beta">Beta status</a>')
    .replace('href="../index.html">Back to the guide</a>', 'href="../index.html" data-guide-copy="backGuide">Back to the guide</a>');
  const slug = file.replace(/\.md$/, ".html");
  const social = `<meta property="og:title" content="${escape(title)} | Farm Tycoon Field Guide"><meta property="og:description" content="Farm Tycoon field guide wiki: ${escape(title)}"><meta property="og:url" content="https://ding-ding-projects.github.io/roblox-farm-tycoon-guide/wiki/${slug}"><meta property="og:type" content="article"><meta property="og:site_name" content="Farm Tycoon Field Guide"><meta property="og:image" content="https://ding-ding-projects.github.io/roblox-farm-tycoon-guide/social-preview.png"><meta property="og:image:width" content="1264"><meta property="og:image:height" content="830"><meta property="og:image:alt" content="The real Farm Tycoon timber barn interior"><meta name="twitter:card" content="summary_large_image">`;
  writeFileSync(join(output, slug), frontPage.replace("</head>", `${social}</head>`));
}
writeFileSync(join(output, "index.html"), readFileSync(join(output, "Home.html"), "utf8").replace("https://ding-ding-projects.github.io/roblox-farm-tycoon-guide/wiki/Home.html", "https://ding-ding-projects.github.io/roblox-farm-tycoon-guide/wiki/"));
writeFileSync(join(root, "search-index.js"), `// Generated from reviewed wiki-source Markdown. Do not edit by hand.\nexport const wikiPages = ${JSON.stringify(searchPages)};\n`);
console.log(`Built ${files.length} site-hosted wiki pages.`);
