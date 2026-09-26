import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const build = { version, builtAtUtc: new Date().toISOString(), sourceCommit };
writeFileSync(new URL("../release.json", import.meta.url), `${JSON.stringify(build, null, 2)}\n`);
console.log(`Guide ${version} provenance recorded for source ${sourceCommit}`);
