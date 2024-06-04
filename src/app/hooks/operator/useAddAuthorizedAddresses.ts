import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { z } from 'zod';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

type FormValues = {
  addresses: { value: string }[];
};

export const useAddAuthorizedAddresses = () => {
  const selectedOperator = useAppSelector(getSelectedOperator);

  const addressesMap = useMemo(
    () => new Map(selectedOperator.whitelistAddresses?.map((a) => [a, true])),
    [selectedOperator.whitelistAddresses]
  );

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
              if (foundIndex !== index || addressesMap.has(address.value)) {
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
