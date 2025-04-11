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
 * Test is setup to find all images within a test case directory
 * this means that if for, for some reason, the generation logic changes to generation multiple images
 * per josn files (i.e. several pages of a PDF), the testing functionality will find all images
 * inside a test case directory.
 *
 * - a custom generateImage function can be passed to the generateImages logic.
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
