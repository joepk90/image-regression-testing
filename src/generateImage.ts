import { PNG } from "pngjs";

/**
 * Generate Image Logic
 *
 * Custom image generation logic - Adjust this logic to change how the image should be generated.
 */

export type ImageOptions = {
  width: number;
  height: number;
  color: string;
};

export const hexToRgb = (hex: string) => {
  const result = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!result) {
    throw new Error("Invalid HEX color");
  }
  const r = parseInt(result[1].substring(0, 2), 16);
  const g = parseInt(result[1].substring(2, 4), 16);
  const b = parseInt(result[1].substring(4, 6), 16);
  return { r, g, b };
};

export const populatePixels = (png: PNG, options: ImageOptions): PNG => {
  const { width, height, color: hexColor } = options;
  const { r, g, b } = hexToRgb(hexColor);

  // Create a buffer for the image with all pixels set to the same color
  const color = [r, g, b, 255]; // RGBA (fully opaque)
  const pixelCount = width * height;
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    png.data[idx] = color[0]; // Red channel
    png.data[idx + 1] = color[1]; // Green channel
    png.data[idx + 2] = color[2]; // Blue channel
    png.data[idx + 3] = color[3]; // Alpha (fully opaque)
  }

  return png;
};

export const generateImage = (options: ImageOptions): PNG => {
  const { width, height } = options;

  const png = new PNG({
    width,
    height,
    filterType: -1,
  });

  return populatePixels(png, options);
};
