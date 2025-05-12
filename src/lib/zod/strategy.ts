import { z } from "zod";

const protocolRegex = /^(https?:\/\/)/;
const urlRegex = /^(https?:\/\/)[\w.-]+\.[a-z]{2,}.*\/[\w.-]+\.json$/i;
export const metadataURISchema = z
  .string()
  .trim()
  .transform<string>((url) =>
    !protocolRegex.test(url) ? `https://${url}` : url,
  )
  .refine((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, "Invalid URL")
  .refine(
    (url) => urlRegex.test(url),
    "Invalid URI format. Please ensure the URI ends with “.json”",
  );
