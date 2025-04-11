import { readFileSync, createWriteStream } from "fs";
import path from "path";
import { PNG } from "pngjs";

import { DIFF_DIR_NAME } from "src/utils/consts";
import { log } from "src/utils/logs";
import {
  getCurrentImagePath,
  getReferenceImagePath,
  createDirIfNonExistent,
  VisualTestCase,
} from "src/utils/fs";

const getImage = async (imagePath: string) => {
  const buffer = readFileSync(imagePath);
  const pngImage = await PNG.sync.read(buffer);
  return pngImage;
};

export const getCurrentImage = async (parentDir: string, imageName: string) => {
  const actualImagePath = await getCurrentImagePath(parentDir, imageName);
  return await getImage(actualImagePath);
};

export const getReferenceImage = async (
  parentDir: string,
  imageName: string
) => {
  const actualImagePath = await getReferenceImagePath(parentDir, imageName);
  return await getImage(actualImagePath);
};

export const writeImageToFile = async (png: PNG, path: string) => {
  return await new Promise<void>((resolve, reject) => {
    const stream = png.pack().pipe(createWriteStream(path));
    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
};

export const saveDiffImage = async (
  diffImage: PNG,
  testCase: VisualTestCase,
  refImageName: string
) => {
  const { parentDir, jsonFilename } = testCase;

  log(
    `Image comparison failed: images for ${refImageName} of ${jsonFilename} are not equal\n`,
    "error"
  );

  const diffImageOutputDir = path.join(parentDir, DIFF_DIR_NAME);
  createDirIfNonExistent(diffImageOutputDir);

  const diffImageOutputPath = path.join(
    diffImageOutputDir,
    `diff.${refImageName}`
  );

  log(
    `Look at diff image stored in ${diffImageOutputPath} to see more detail\n`,
    "info"
  );

  await writeImageToFile(diffImage, diffImageOutputPath);
};
