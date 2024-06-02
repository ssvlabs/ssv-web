import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { z } from 'zod';
import { useOperatorPermissions } from '~app/hooks/operator/useOperatorPermissions';

type FormValues = {
  addresses: { value: string }[];
};

export const useAddAuthorizedAddresses = () => {
  const { addressesMap } = useOperatorPermissions();

  const formSchema = useMemo(
    () =>
      z.object({
        addresses: z
          .array(
            z.object({
              value: z.string().refine(isAddress, 'Owner address must be a valid address format')
            })
          )
          .superRefine((arr, ctx) => {
            arr.forEach((address, index) => {
              const foundIndex = arr.findIndex((a) => a.value === address.value);
              if (foundIndex !== index || addressesMap[address.value]) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'The address you specified is already in use',
                  path: [index, 'value']
                });
              }
            });
          })
      }) satisfies z.ZodType<FormValues>,
    [addressesMap]
  );

  const form = useForm<FormValues>({
    defaultValues: {
      addresses: []
    },
    resolver: zodResolver(formSchema)
  });

  const fieldArray = useFieldArray({
    name: 'addresses',
    control: form.control
  });

  return {
    form,
    fieldArray,
    hasAddresses: fieldArray.fields.length > 0
  };
};
