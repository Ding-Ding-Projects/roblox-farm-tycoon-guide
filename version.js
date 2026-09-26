export const unavailableVersion = "Guide version unavailable · Updated time unavailable";

export function formatGuideVersion(release, options = {}) {
  if (!release || typeof release.version !== "string" || !/^\d+\.\d+\.\d+$/.test(release.version)
    || typeof release.sourceCommit !== "string" || !/^[a-f0-9]{40}$/.test(release.sourceCommit)
    || typeof release.builtAtUtc !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(release.builtAtUtc)) {
    return unavailableVersion;
  }
  const stamp = new Date(release.builtAtUtc);
  if (!Number.isFinite(stamp.getTime())) return unavailableVersion;
  try {
    const timeZone = options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone) return unavailableVersion;
    const date = new Intl.DateTimeFormat(options.locale, {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
      timeZone, timeZoneName: "short",
    }).format(stamp);
    return `Guide ${release.version} · Updated ${date} (${timeZone} local time)`;
  } catch {
    return unavailableVersion;
  }
}
