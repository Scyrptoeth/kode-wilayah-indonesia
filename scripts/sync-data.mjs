#!/usr/bin/env node

/**
 * Sync region data from the independent data repository into public/data/.
 *
 * Usage:
 *   node scripts/sync-data.mjs
 *   node scripts/sync-data.mjs --repo /absolute/or/relative/path/to/wilayah-indonesia-data
 *   node scripts/sync-data.mjs --repo https://github.com/Scyrptoeth/wilayah-indonesia-data.git
 */

import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  copyFileSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const TARGET_DIR = path.join(PROJECT_ROOT, "public", "data");
const DEFAULT_REPO = "https://github.com/Scyrptoeth/wilayah-indonesia-data.git";

const args = process.argv.slice(2);
const repoArgIndex = args.indexOf("--repo");
const repoInput = repoArgIndex >= 0 ? args[repoArgIndex + 1] : process.env.DATA_REPO_URL;
const repoSource = repoInput || DEFAULT_REPO;

function isLocalPath(input) {
  return existsSync(input) && statSync(input).isDirectory();
}

function copyRecursive(source, target) {
  const entries = readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(targetPath, { recursive: true });
      copyRecursive(sourcePath, targetPath);
    } else if (entry.name.endsWith(".json")) {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

function assertCoverage(dataDir) {
  const expected = [
    { file: "provinces.json", minCount: 1 },
    { file: "regencies.json", minCount: 1 },
    { file: "districts.json", minCount: 1 },
  ];

  for (const { file, minCount } of expected) {
    const filePath = path.join(dataDir, file);
    if (!existsSync(filePath)) {
      throw new Error(`Missing required data file: ${file}`);
    }
    const content = readFileSync(filePath, "utf-8");
    const count = JSON.parse(content).length;
    if (count < minCount) {
      throw new Error(`Data file ${file} has insufficient records: ${count}`);
    }
  }

  const villagesDir = path.join(dataDir, "villages");
  if (!existsSync(villagesDir)) {
    throw new Error("Missing villages directory");
  }
  const villageFiles = readdirSync(villagesDir).filter((file) => file.endsWith(".json"));
  if (villageFiles.length === 0) {
    throw new Error("No village data files found");
  }
}

function cloneRepo(url, target) {
  try {
    execSync(`git clone --depth 1 "${url}" "${target}"`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function sync() {
  console.log(`Syncing data from: ${repoSource}`);

  let sourceDir;
  let shouldCleanup = false;

  if (isLocalPath(repoSource)) {
    sourceDir = path.resolve(repoSource);
    console.log(`Using local directory: ${sourceDir}`);
  } else {
    const tempDir = path.join(PROJECT_ROOT, ".tmp-data-sync");
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    mkdirSync(tempDir, { recursive: true });
    console.log(`Cloning repository into: ${tempDir}`);
    const cloned = cloneRepo(repoSource, tempDir);
    if (cloned) {
      sourceDir = tempDir;
      shouldCleanup = true;
    } else {
      console.warn(`Failed to clone ${repoSource}. Falling back to existing data in ${TARGET_DIR}.`);
      rmSync(tempDir, { recursive: true, force: true });
      assertCoverage(TARGET_DIR);
      console.log("Data sync skipped; existing data is intact.");
      return;
    }
  }

  mkdirSync(TARGET_DIR, { recursive: true });

  // Clean existing villages directory to avoid stale files.
  const villagesTarget = path.join(TARGET_DIR, "villages");
  if (existsSync(villagesTarget)) {
    rmSync(villagesTarget, { recursive: true, force: true });
  }

  copyRecursive(sourceDir, TARGET_DIR);

  // Remove old top-level JSON files that are not in source.
  const sourceFiles = new Set(readdirSync(sourceDir).filter((name) => name.endsWith(".json")));
  for (const entry of readdirSync(TARGET_DIR, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".json") && !sourceFiles.has(entry.name)) {
      rmSync(path.join(TARGET_DIR, entry.name), { force: true });
    }
  }

  assertCoverage(TARGET_DIR);

  if (shouldCleanup) {
    rmSync(sourceDir, { recursive: true, force: true });
  }

  console.log("Data sync completed successfully.");
}

sync();
