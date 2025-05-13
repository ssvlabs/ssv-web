import { useFetchAccountsMetadata } from "@/hooks/b-app/use-account-metadata";
import { useFetchStrategiesMetadata } from "@/hooks/b-app/use-strategy-metadata";
import { metadataURISchema } from "@/lib/zod/strategy";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type MetadataEditorFormValues = {
  strategyMetadataURI: string;
  accountMetadataURI: string;
};

type MetadataEditorProps = {
  strategyId: string;
  defaultValues?: MetadataEditorFormValues;
  onSubmit: (values: MetadataEditorFormValues) => void;
};

export const useMetadataEditor = ({
  strategyId,
  defaultValues,
  onSubmit,
}: MetadataEditorProps) => {
  const fetchStrategiesMetadata = useFetchStrategiesMetadata();
  const isFetchingStrategiesMetadata = fetchStrategiesMetadata.isPending;

  const fetchAccountsMetadata = useFetchAccountsMetadata();
  const isFetchingAccountsMetadata = fetchAccountsMetadata.isPending;

  const schema = z.object({
    strategyMetadataURI: z.union([
      z.literal(""),
      metadataURISchema.superRefine(async (url, ctx) => {
        const [, error] = await fetchStrategiesMetadata
          .mutateAsync([
            {
              id: strategyId,
              url,
            },
          ])
          .then((data) => {
            if (!data[strategyId]) {
              throw new Error("No metadata found");
            }
            return [data[strategyId], null];
          })
          .catch((err) => [null, err]);
        if (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error.message,
          });
        }
      }),
    ]),
    accountMetadataURI: z.union([
      z.literal(""),
      metadataURISchema.superRefine(async (url, ctx) => {
        const [, error] = await fetchAccountsMetadata
          .mutateAsync([
            {
              id: strategyId,
              url,
            },
          ])
          .then((data) => {
            if (!data.length) {
              throw new Error("No metadata found");
            }
            return [data[0], null];
          })
          .catch((err) => [null, err]);
        if (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error.message,
          });
        }
      }),
    ]),
  });

  const form = useForm<MetadataEditorFormValues>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(schema),
  });

  const submit = form.handleSubmit(onSubmit);

  return {
    form,
    submit,
    isFetchingStrategiesMetadata,
    isFetchingAccountsMetadata,
  };
};
