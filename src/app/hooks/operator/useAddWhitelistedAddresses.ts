import { useFieldArray, useForm } from 'react-hook-form';

export const useAddWhitelistedAddresses = () => {
  const form = useForm<{ addresses: string[] }>({
    defaultValues: {
      addresses: []
    }
  });

  const fieldArray = useFieldArray({
    name: 'addresses',
    control: form.control
  });

  fieldArray;
};
