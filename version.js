export const unavailableVersion = "Guide version unavailable · Updated time unavailable";
const unavailableYue = "指南版本未能取得 · 更新時間未能取得";
const versionText = (english, cantonese, language) => language === "yue" ? cantonese : language === "bilingual" ? `${english} · ${cantonese}` : english;

export function formatGuideVersion(release, options = {}) {
  if (!release || typeof release.version !== "string" || !/^\d+\.\d+\.\d+$/.test(release.version)
    || typeof release.sourceCommit !== "string" || !/^[a-f0-9]{40}$/.test(release.sourceCommit)
    || typeof release.builtAtUtc !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(release.builtAtUtc)) {
    return versionText(unavailableVersion, unavailableYue, options.language);
  }
  const stamp = new Date(release.builtAtUtc);
  if (!Number.isFinite(stamp.getTime())) return versionText(unavailableVersion, unavailableYue, options.language);
  try {
    const timeZone = options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone) return versionText(unavailableVersion, unavailableYue, options.language);
    const date = new Intl.DateTimeFormat(options.locale, {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
      timeZone, timeZoneName: "short",
    }).format(stamp);
    const english = `Guide ${release.version} · Updated ${date} (${timeZone} local time)`;
    const cantonese = `指南 ${release.version} · 更新於 ${date}（${timeZone} 本地時間）`;
    return versionText(english, cantonese, options.language);
  } catch {
    return versionText(unavailableVersion, unavailableYue, options.language);
  }
}
