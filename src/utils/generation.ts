import path from "path";
import { PNG } from "pngjs";

import {
  getAllTestCases,
  createDirIfNonExistent,
  readJsonFile,
  writeImageToFile,
} from "src/utils";

/**
 * Generate Images Function:
 *
 * requires a custom generateImage function to handle image generation
 *
 * Generates images to a target directory within the .imageTests directory.
 * @param generateImage
 * @param outputDir
 */

type GenerateImagesProps<I> = {
  generateImage: (options: I) => PNG;
  outputDir: string;
};

export const generateImages = async <I>({
  generateImage,
  outputDir,
}: GenerateImagesProps<I>) => {
  const testCases = await getAllTestCases();

  console.log("=== GENERATING IMAGES ===");
  return await Promise.all(
    testCases.map(async (testCase) => {
      console.log("GENERATING IMAGE: ", testCase.jsonFilename);

      const options = readJsonFile(testCase.path);

      // loop through each element in the json file (each json file can generate multiple images)
      for (const [index, option] of options.entries()) {
        const png = await generateImage(option); // custom function passed in in the run... scripts
        const jsonFileName = testCase.jsonFilename.replace(".json", "");
        const pngName = `${jsonFileName}-${index + 1}.png`;

        const outputDirectory = path.join(testCase.parentDir, outputDir);

        // create directory if it doesn't exist
        createDirIfNonExistent(outputDirectory);

        // write file to directory
        const referencePath = path.join(outputDirectory, pngName);
        await writeImageToFile(png, referencePath);
      }
    })
  );
};
