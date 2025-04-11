import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import {
  getCurrentImage,
  saveDiffImage,
  getReferenceImage,
  VisualTestCase,
  getReferenceImagePaths,
} from "src/utils";

export const compareTestCase = async (
  testCase: VisualTestCase,
  refImageName: string
) => {
  const { parentDir } = testCase;
  const actualImage = await getCurrentImage(parentDir, refImageName);
  const expectedImage = await getReferenceImage(parentDir, refImageName);

  console.log("COMPARING IMAGE: ", refImageName);
  const { numDiffPixels, diffImage } = compareImage(actualImage, expectedImage);

  const imageAreEqual = numDiffPixels === 0;

  if (!imageAreEqual) {
    await saveDiffImage(diffImage, testCase, refImageName);
  }

  return imageAreEqual;
};

export const compareImage = (expectedImage: PNG, actualImage: PNG) => {
  const { width: expectedWidth, height: expectedHeight } = expectedImage;
  const { width: actualWidth, height: actualHeight } = actualImage;

  // create diff image for pixelmatch diff image output (otputs a new image with pixel differences)
  const diffImage = new PNG({ width: actualWidth, height: actualHeight });

  const diffOptions = {
    threshold: 0,
  };
  const numDiffPixels = pixelmatch(
    expectedImage.data,
    actualImage.data,
    diffImage.data,
    expectedWidth,
    expectedHeight,
    diffOptions
  );

  return { numDiffPixels, diffImage };
};

export const compareTestCases = async (testCase: VisualTestCase) => {
  const { parentDir } = testCase;

  const referenceImagesNames = await getReferenceImagePaths(parentDir);

  let allImagesAreEqual = true;
  for (const refImageName of referenceImagesNames) {
    const imageIsEqual = await compareTestCase(testCase, refImageName);

    if (!imageIsEqual) {
      allImagesAreEqual = false;
    }
  }

  return allImagesAreEqual;
};
