import { existsSync, mkdirSync, readdirSync, statSync } from "fs";
import * as fs from "fs";
import { packageDirectory } from "pkg-dir";
import path from "path";

import {
  REFERENCE_DIR_NAME,
  CURRENT_DIR_NAME,
  IMAGE_TEST_DIR,
} from "src/utils/consts";

export type VisualTestCase = {
  parentDir: string;
  path: string;
  jsonFilename: string;
};

const getImagePath = (
  parentDir: string,
  testDir: string,
  imageName: string
) => {
  return path.join(parentDir, testDir, imageName);
};

export const getReferenceImagePath = (parentDir: string, imageName: string) => {
  return getImagePath(parentDir, REFERENCE_DIR_NAME, imageName);
};

export const getCurrentImagePath = (parentDir: string, imageName: string) => {
  return getImagePath(parentDir, CURRENT_DIR_NAME, imageName);
};

export const readJsonFile = (path: string) => {
  if (!fs.existsSync(path)) {
    console.warn(`JSON file not found at ${path}`);
  }

  return JSON.parse(fs.readFileSync(path, "utf-8"));
};

export const createDirIfNonExistent = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};

// Recursively searches for json files in given directory (each json file represents one test case)
export const getAllTestCasesInDir = (
  baseDir: string,
  testCasesSoFar: VisualTestCase[] = []
) => {
  const currentDirContent = readdirSync(baseDir);
  let testCases = testCasesSoFar || [];

  currentDirContent.forEach((file) => {
    const newBaseDir = path.join(baseDir, file);

    if (statSync(newBaseDir).isDirectory()) {
      testCases = getAllTestCasesInDir(newBaseDir, testCases);
    } else if (path.extname(file) === `.json`) {
      testCases.push({
        parentDir: baseDir,
        path: newBaseDir,
        jsonFilename: file,
      });
    }
  });

  return testCases;
};

export const getAllTestCases = async () => {
  const projectRoot = await packageDirectory();

  // Optional subpath command line argument
  const subpath = process.argv[2] || "";

  return getAllTestCasesInDir(
    path.join(projectRoot as string, IMAGE_TEST_DIR, subpath)
  );
};

export const getReferenceImagePaths = async (parentDir: string) => {
  return await readdirSync(path.join(parentDir, REFERENCE_DIR_NAME));
};
