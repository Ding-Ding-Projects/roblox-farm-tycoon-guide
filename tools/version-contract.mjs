import { formatGuideVersion, unavailableVersion } from "../version.js";

export function verifyVersionContract({ release, packageVersion, sourcePackageVersion, home, wikiPages }) {
  if (release?.version !== packageVersion || release.version !== sourcePackageVersion
    || !/^[a-f0-9]{40}$/.test(release.sourceCommit || "")
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(release.builtAtUtc || "")
    || !Number.isFinite(Date.parse(release.builtAtUtc))) throw Error("release provenance is invalid or stale");
  const expected = `Guide ${release.version}`;
  const formatted = formatGuideVersion(release, { locale: "en-US", timeZone: "UTC" });
  if (!formatted.startsWith(expected) || !/\d{2}:\d{2}:\d{2}/.test(formatted) || !formatted.includes("(UTC local time)")) {
    throw Error("version formatting lost seconds or timezone");
  }
  if (formatGuideVersion({}) !== unavailableVersion) throw Error("invalid provenance must remain unavailable");
  for (const [path, html, marker] of [["index.html", home, "version-line"], ...wikiPages.map(([path, html]) => [path, html, "wiki-version"])]) {
    const id = `id="${marker}"`;
    if (html.split(id).length !== 2) throw Error(`version marker missing or repeated: ${path}`);
    const header = /<header\b[^>]*>([\s\S]*?)<\/header>/.exec(html)?.[1];
    const exactElement = `<p class="version-line front-version" ${id} role="status" aria-live="polite">${unavailableVersion}</p>`;
    if (!header || header.indexOf(exactElement) < 0 || header.indexOf(exactElement) > header.indexOf("<nav")) {
      throw Error(`front-screen version boundary missing: ${path}`);
    }
  }
}
