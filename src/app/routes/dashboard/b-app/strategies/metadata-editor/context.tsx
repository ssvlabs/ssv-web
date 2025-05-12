import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const protocolRegex = /^(https?:\/\/)/;
const urlRegex = /^(https?:\/\/)[\w.-]+\.[a-z]{2,}.*\/[\w.-]+\.json$/i;

const httpsURLSchema = z
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
    'Invalid URI format. Please ensure the URI ends with ".json"',
  );

const schema = z.object({
  strategyMetadataURI: z.union([z.literal(""), httpsURLSchema]),
  accountMetadataURI: z.union([z.literal(""), httpsURLSchema]),
});

type MetadataFormValues = z.infer<typeof schema>;

interface MetadataContextType {
  form: ReturnType<typeof useForm<MetadataFormValues>>;
}

const MetadataContext = createContext<MetadataContextType | null>(null);

export const MetadataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<MetadataFormValues>({
    mode: "all",
    defaultValues: { strategyMetadataURI: "", accountMetadataURI: "" },
    resolver: zodResolver(schema),
  });

  return (
    <MetadataContext.Provider value={{ form }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};
