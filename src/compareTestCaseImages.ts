import assert from "node:assert";
import { describe, it } from "node:test";
import {
  getAllTestCases,
  VisualTestCase,
  CURRENT_DIR_NAME,
  compareTestCases,
  generateImages,
} from "src/utils";

import { generateImage } from "src/generateImage";
/**
 * Comparing Test Case Images
 *
 * A test suite is setup to firsty generate all the test case images to an `actual` directory in `.imageTests`.
 * The test suite then finds all the newly generated images and compares them to the reference images - images
 * previously exported to the reference directly and commited.
 *
 * A custom generateImage function can be passed to the generateImages logic.
 * - this allows us to decouple the implementation of the image generation logic from the comparison of images
 */

describe("Image Regression Tests", async () => {
  await generateImages({
    generateImage, // custom function
    outputDir: CURRENT_DIR_NAME,
  });

  const testCases = await getAllTestCases();
  console.log("=== COMPARING IMAGES ===");
  testCases.forEach(async (testCase: VisualTestCase) => {
    it(`Test PDF images for invoice: ${testCase.jsonFilename}`, async () => {
      const success = await compareTestCases(testCase);

      assert.strictEqual(success, true);
    });
  });
});
