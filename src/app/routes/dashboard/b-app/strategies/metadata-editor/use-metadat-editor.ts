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
      metadataURISchema.refine(async (url) => {
        if (metadataURISchema.safeParse(url).error) {
          fetchStrategiesMetadata.reset();
          return false;
        }
        const [data] = await fetchStrategiesMetadata
          .mutateAsync([
            {
              id: strategyId,
              url,
            },
          ])
          .then((data) => {
            if (!data.list.at(0)) {
              throw new Error("No metadata found");
            }
            return [data.list.at(0), null];
          })
          .catch((err) => [null, err]);
        return Boolean(data);
      }, "No metadata found"),
    ]),
    accountMetadataURI: z.union([
      z.literal(""),
      metadataURISchema.refine(async (url) => {
        if (metadataURISchema.safeParse(url).error) {
          fetchAccountsMetadata.reset();
          return false;
        }
        const [data] = await fetchAccountsMetadata
          .mutateAsync([
            {
              id: strategyId,
              url,
            },
          ])
          .then((data) => {
            if (!data.list.at(0)) {
              throw new Error();
            }
            return [data.list.at(0), null];
          })
          .catch((err) => [null, err]);
        return Boolean(data);
      }, "No metadata found"),
    ]),
  });

  const form = useForm<MetadataEditorFormValues>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(schema, {}),
  });

  useEffect(() => {
    form.setValue(
      "accountMetadataURI",
      defaultValues?.accountMetadataURI || "",
      { shouldValidate: true },
    );

    form.setValue(
      "strategyMetadataURI",
      defaultValues?.strategyMetadataURI || "",
      { shouldValidate: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues?.accountMetadataURI,
    defaultValues?.strategyMetadataURI,
    form.setValue,
  ]);

  return {
    form,
    fetchAccountsMetadata,
    fetchStrategiesMetadata,
  };
};
