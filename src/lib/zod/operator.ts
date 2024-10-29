import { z } from "zod";

async function getImageInfo(
  file: File,
): Promise<{ width: number; height: number; sizeKB: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const sizeKB = file.size / 1024;
      resolve({ width: img.width, height: img.height, sizeKB });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export const operatorLogoSchema = z
  .union([z.instanceof(File), z.string()])
  .refine(
    async (file: File | string) => {
      if (file instanceof File) {
        const { sizeKB } = await getImageInfo(file);
        return sizeKB <= 200; // Проверяем размер в KB
      }
      return true;
    },
    { message: "File must be up to 200KB" },
  )
  .refine(
    async (file: File | string) => {
      if (file instanceof File) {
        const { width, height } = await getImageInfo(file);
        return width > 400 && height > 400; // Проверяем разрешение
      }
      return true;
    },
    { message: "Image dimensions must be at least 400x400px." },
  )
  .transform(async (file: File | string) => {
    if (file instanceof File) {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function (e) {
          if (e?.target?.readyState === FileReader.DONE) {
            const base64String = e.target.result as string;
            resolve(base64String);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else {
      return "";
    }
  })
  .default("");
