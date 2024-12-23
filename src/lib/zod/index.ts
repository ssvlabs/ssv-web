import { tryCatch } from "@/lib/utils/tryCatch";
import { z } from "zod";

const protocolRegex = /^(http|https?:\/\/)/;

const getExplicitPort = (urlString: string): string => {
  const portMatch = urlString.match(/:(\d+)/);
  if (portMatch) {
    return portMatch[1];
  }
  return "";
};

export const httpsURLSchema = z
  .string()
  .trim()
  .transform<string>((url) =>
    !protocolRegex.test(url) ? `https://${url}` : url,
  )
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;
      const parts = domain.split(".");
      return parts.length >= 2 && parts[parts.length - 1].length >= 2;
    } catch {
      return false;
    }
  }, "Invalid URL");

export const dgkURLSchema = z
  .string()
  .trim()
  .refine((str) => protocolRegex.test(str), "URL must start with https://")
  .refine(
    (str) =>
      tryCatch(() => {
        const url = new URL(str);
        return Boolean(
          url.protocol === "https:" && (url.port || getExplicitPort(str)),
        );
      }, false),
    "Enter a valid IP address and port number",
  );
