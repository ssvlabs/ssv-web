import { useFieldArray, useForm } from "react-hook-form";

type FormValues = {
  assets: { value: string }[];
};

export const useAddAsset = () => {
  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      assets: [{ value: "asd" }],
    },
  });

  const fieldArray = useFieldArray({
    name: "assets",
    control: form.control,
  });

  const addField = () => {
    fieldArray.append({ value: "" });
  };

  const removeField = (index: number) => {
    fieldArray.remove(index);
  };

  const assets = form.watch("assets");

  return {
    form,
    fieldArray,
    addField,
    removeField,
    assets,
  };
};
