import {
  Abi,
  AbiFunction,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
  AbiParameterToPrimitiveType,
  AbiType,
  AbiTypeToPrimitiveType,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";

export type AbiInputsToParams<T extends readonly AbiParameter[]> = {
  [K in T[number] as K["name"] extends string
    ? K["name"]
    : never]: AbiParameterToPrimitiveType<K>;
};

export const paramsToArray = <
  Fn extends AbiFunction,
  Params extends Record<string, AbiTypeToPrimitiveType<AbiType>>,
>({
  params,
  abiFunction,
}: {
  params: Params;
  abiFunction: Fn;
}) => {
  return abiFunction.inputs.reduce(
    (acc, param) => {
      if (param.name && params[param.name]) {
        return [...acc, params[param.name]] as AbiParametersToPrimitiveTypes<
          Fn["inputs"]
        >;
      } else {
        console.error(`Missing argument for ${param}`);
      }
      return acc;
    },
    [] as AbiParametersToPrimitiveTypes<Fn["inputs"]>,
  );
};

export const extractAbiFunction = <
  abi extends Abi,
  functionName extends ExtractAbiFunctionNames<abi>,
>(
  abi: abi,
  functionName: functionName,
) => {
  return abi.find((abiFunction) => {
    if (abiFunction.type !== "function") return false;
    return abiFunction?.name === functionName;
  }) as ExtractAbiFunction<abi, functionName>;
};
