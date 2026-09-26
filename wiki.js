import { formatGuideVersion } from "./version.js";

fetch("../release.json", { cache: "no-store" }).then(response => response.ok ? response.json() : Promise.reject()).then(release => {
  document.querySelector("#wiki-version").textContent = formatGuideVersion(release);
}).catch(() => {});
