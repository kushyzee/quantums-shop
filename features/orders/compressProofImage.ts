"use client";

const MAX_DIMENSION_PX = 1600;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.1;
const STARTING_QUALITY = 0.9;

export async function compressProofImage(
  file: File,
  maxSizeBytes: number,
): Promise<File> {
  if (file.size <= maxSizeBytes) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = scaledDimensions(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);

  let quality = STARTING_QUALITY;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > maxSizeBytes && quality > MIN_QUALITY) {
    quality -= QUALITY_STEP;
    blob = await canvasToBlob(canvas, quality);
  }

  return new File([blob], renameToJpeg(file.name), { type: "image/jpeg" });
}

function scaledDimensions(width: number, height: number) {
  const largestSide = Math.max(width, height);
  if (largestSide <= MAX_DIMENSION_PX) {
    return { width, height };
  }
  const scale = MAX_DIMENSION_PX / largestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Image compression failed")),
      "image/jpeg",
      quality,
    );
  });
}

function renameToJpeg(originalName: string): string {
  const base = originalName.replace(/\.[^./]+$/, "");
  return `${base}.jpg`;
}
