import { useFetchAccountsMetadata } from "@/hooks/b-app/use-account-metadata";
import { useFetchStrategiesMetadata } from "@/hooks/b-app/use-strategy-metadata";
import { metadataURISchema } from "@/lib/zod/strategy";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type MetadataEditorFormValues = {
  strategyMetadataURI: string;
  accountMetadataURI: string;
};

type MetadataEditorProps = {
  strategyId: string;
  defaultValues?: MetadataEditorFormValues;
};

export const useMetadataEditor = ({
  strategyId,
  defaultValues,
}: MetadataEditorProps) => {
  const fetchStrategiesMetadata = useFetchStrategiesMetadata();
  const fetchAccountsMetadata = useFetchAccountsMetadata();

  const schema = z.object({
    strategyMetadataURI: z.union([
      z.literal(""),
      metadataURISchema.refine((url) => {
        if (metadataURISchema.safeParse(url).error) {
          fetchStrategiesMetadata.reset();
          return false;
        }
        fetchStrategiesMetadata.mutateAsync([
          {
            id: strategyId,
            url,
          },
        ]);
        return true;
      }, "Invalid metadata URI"),
    ]),
    accountMetadataURI: z.union([
      z.literal(""),
      metadataURISchema.refine((url) => {
        if (metadataURISchema.safeParse(url).error) {
          fetchAccountsMetadata.reset();
          return false;
        }
        fetchAccountsMetadata.mutateAsync([
          {
            id: strategyId,
            url,
          },
        ]);
        return true;
      }, "Invalid metadata URI"),
    ]),
  });

  const form = useForm<MetadataEditorFormValues>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(schema, {}),
  });

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.accountMetadataURI, defaultValues?.strategyMetadataURI]);

  return {
    form,
    fetchAccountsMetadata,
    fetchStrategiesMetadata,
  };
};
