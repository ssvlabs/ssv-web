import { useOperator } from "@/hooks/operator/use-operator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { isAddress } from "viem";
import { z } from "zod";

type FormValues = {
  addresses: { value: string }[];
};

export const useAddAuthorizedAddresses = () => {
  const { data: operator } = useOperator();
  const addressesMap = useMemo(
    () => new Map(operator?.whitelist_addresses?.map((a) => [a, true])),
    [operator?.whitelist_addresses],
  );

  const formSchema = useMemo(
    () =>
      z.object({
        addresses: z
          .array(
            z.object({
              value: z
                .string()
                .trim()
                .refine(
                  (addr): addr is `0x${string}` =>
                    addr.trim() === "" || isAddress(addr),
                  "Owner address must be a valid address format",
                ),
            }),
          )
          .refine((arr) => {
            return (
              arr.length + (operator?.whitelist_addresses?.length || 0) <= 500
            );
          }, "You can add up to 500 addresses")
          .superRefine((arr, ctx) => {
            const set = new Set<`0x${string}`>();
            for (let i = 0; i < arr.length; i++) {
              if (set.has(arr[i].value) || addressesMap.has(arr[i].value)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "The address you specified is already in use",
                  path: [i, "value"],
                });
              }
              set.add(arr[i].value);
            }
          }),
      }) satisfies z.ZodType<FormValues>,
    [addressesMap, operator?.whitelist_addresses?.length],
  );

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      addresses: [],
    },
    resolver: zodResolver(formSchema),
  });

  const fieldArray = useFieldArray({
    name: "addresses",
    control: form.control,
  });

  const addresses = form.watch("addresses");
  const hasErrors = Boolean(form.formState.errors.addresses);
  const hasEmptyAddresses = addresses.some((field) => !field.value);
  const validAddresses = addresses.filter((field) => field.value.trim() !== "");
  const hasAddresses = addresses.length > 0;

  return {
    form,
    fieldArray,
    hasAddresses,
    hasEmptyAddresses,
    hasErrors,
    validAddresses,
    isSubmitDisabled: hasErrors || validAddresses.length === 0,
  };
};
