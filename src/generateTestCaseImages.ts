import { generateImages } from "src/utils";
import { generateImage } from "src/generateImage";
import { REFERENCE_DIR_NAME } from "src/utils";

/**
 * Generate Images
 * - a custom generateImage function can be passed to the generateImages logic.
 * - this allows us to decouple the implementation of the image generation logic from the generation of test cases
 */

generateImages({
  generateImage, // custom function
  outputDir: REFERENCE_DIR_NAME,
});
