fetch("../release.json", { cache: "no-store" }).then(response => response.ok ? response.json() : Promise.reject()).then(release => {
  const stamp = new Date(release.builtAtUtc);
  if (!release.version || !Number.isFinite(stamp.getTime())) return;
  document.querySelector("#wiki-version").textContent = `Guide ${release.version} · Updated ${stamp.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "long" })}`;
}).catch(() => {});
