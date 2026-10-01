#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = process.cwd();

const readTextFile = (relativePath) =>
  readFileSync(resolve(repoRoot, relativePath), "utf8");

const listFiles = (relativeDirectoryPath) =>
  readdirSync(resolve(repoRoot, relativeDirectoryPath), {
    withFileTypes: true,
  }).flatMap((entry) => {
    const relativePath = `${relativeDirectoryPath}/${entry.name}`;

    return entry.isDirectory() ? listFiles(relativePath) : [relativePath];
  });

const workspacePolicy = readTextFile("pnpm-workspace.yaml");
const requiredWorkspaceFragments = [
  "strictDepBuilds: true",
  "minimumReleaseAge: 1440",
  "blockExoticSubdeps: true",
  "onlyBuiltDependencies:",
];
const workspaceFailures = requiredWorkspaceFragments.flatMap((fragment) =>
  workspacePolicy.includes(fragment)
    ? []
    : [`pnpm-workspace.yaml must contain ${fragment}`],
);
const sourceFiles = listFiles("src").filter(
  (relativePath) =>
    relativePath.endsWith(".ts") || relativePath.endsWith(".tsx"),
);
const forbiddenFragments = [
  "dangerouslySetInnerHTML",
  ".innerHTML",
  ".outerHTML",
  "document.write",
  "insertAdjacentHTML",
];
const sourceFailures = sourceFiles.flatMap((relativePath) => {
  const source = readTextFile(relativePath);

  return forbiddenFragments.flatMap((fragment) =>
    source.includes(fragment)
      ? [`${relativePath} must not contain ${fragment}`]
      : [],
  );
});
const failures = workspaceFailures.concat(sourceFailures);

if (failures.length > 0) {
  failures.forEach((failure) => console.error(failure));
  process.exitCode = 1;
} else {
  console.log("Security policy checks passed.");
}
