import { tryCatch } from "@/lib/utils/tryCatch";
import { z } from "zod";

const protocolRegex = /^(http|https?:\/\/)/;
const domainRegex = /^(?:(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;

export const httpsURLSchema = z
  .string()
  .trim()
  .transform<string>((url) =>
    !protocolRegex.test(url) ? `https://${url}` : url,
  )
  .refine((url) => domainRegex.test(url), "Invalid URL");

export const dgkURLSchema = z
  .string()
  .trim()
  .refine((str) => protocolRegex.test(str), "URL must start with https://")
  .refine(
    (str) =>
      tryCatch(() => {
        const url = new URL(str);
        return Boolean(url.protocol === "https:" && url.port);
      }, false),
    "Enter a valid IP address and port number",
  );
