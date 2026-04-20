import type {
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
      if (param.name) {
        const value = params[param.name];
        if (Number.isNaN(value)) {
          console.warn(`Passed NaN for the [${param.name}] parameter`);
          return [...acc, undefined] as AbiParametersToPrimitiveTypes<
            Fn["inputs"]
          >;
        }
        return [...acc, value] as AbiParametersToPrimitiveTypes<Fn["inputs"]>;
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
