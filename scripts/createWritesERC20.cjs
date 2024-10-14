(async () => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  /* eslint-disable no-undef */
  const fs = require("fs");
  const path = require("path");
  const prettier = require("prettier");
  const typescriptParser = require("prettier/parser-typescript");
  const babelParser = require("prettier/parser-babel");
  const { kebabCase } = await import("lodash-es");

  const abi = require("../src/lib/abi/token.json");

  const folder = path.join(
    path.dirname(__dirname),
    "src/lib/contract-interactions/erc-20/write",
  );

  if (!fs.existsSync(folder)) {
    console.log("Creating folder: ", folder);
    fs.mkdirSync(folder, { recursive: true });
  }

  fs.readdirSync(folder).forEach((file) => {
    fs.unlinkSync(path.join(folder, file));
  });

  const writeFns = abi.filter(
    (item) =>
      item.type === "function" &&
      item.stateMutability !== "view" &&
      item.stateMutability !== "pure",
  );

  const createWriteFn = (isTestnet, item) => {
    const functionName = item.name;
    const hookName = `use${capitalizeFirstLetter(functionName)}${isTestnet ? "_Testnet" : ""}`;
    const fileName = `${kebabCase(hookName)}.ts`;
    const filePath = path.join(folder, `${fileName}`);
    const hasInputs = Boolean(item.inputs?.length);

    const isPayable = item.stateMutability === "payable";

    const abiName = "TokenABI";

    const eventTypeName = isTestnet ? "TestnetEvent" : "MainnetEvent";

    const useWaitForTxHookName = `useWaitForTransactionReceipt${isTestnet ? "_Testnet" : ""}`;

    const content = `
// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

  
import { useWriteContract } from "wagmi";
import {useSSVNetworkDetails} from '@/hooks/use-ssv-network-details';
import type {
  ${eventTypeName},
  MutationOptions,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import {
  ${useWaitForTxHookName},
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { ${abiName} } from "@/lib/abi/token";${
      hasInputs
        ? `
import type {  ExtractAbiFunction } from "abitype";
import type {
  AbiInputsToParams} from "@/lib/contract-interactions/utils";
import  { paramsToArray, extractAbiFunction } from "@/lib/contract-interactions/utils";`
        : ""
    }
import type { WriteContractErrorType } from "@wagmi/core";
import type { WaitForTransactionReceiptErrorType } from "viem";

${hasInputs ? `type Fn = ExtractAbiFunction<typeof ${abiName}, "${functionName}">;` : ""}
${hasInputs ? `const abiFunction = extractAbiFunction(${abiName},"${functionName}");` : ""}
// type State = "idle" | "confirming" | "mining" | "mined" | "error";

export const ${hookName} = () => {
  const { tokenAddress } = useSSVNetworkDetails()

  const wait = ${useWaitForTxHookName}(["${hookName}", tokenAddress]);
  const mutation = useWriteContract();

  const write = (${hasInputs ? 'params: AbiInputsToParams<Fn["inputs"]>,' : ""}${isPayable ? "value?: bigint," : ""}options: MutationOptions<${eventTypeName}> = {}) => {
    options.onInitiated?.();
    return mutation.writeContractAsync({
    ${isPayable ? "value," : ""}
      abi: ${abiName},
      address: tokenAddress,
      functionName: "${functionName}",
      ${hasInputs ? "args: paramsToArray({ params, abiFunction })" : ""}
    },{
          onSuccess: (hash) => options.onConfirmed?.(hash),
          onError: (error) =>
            options.onError?.(error as WriteContractErrorType),
        }
      )
      .then((result) =>
        wait.mutateAsync(result, {
          onSuccess: (receipt) => options.onMined?.(receipt),
          onError: (error) =>
            options.onError?.(error as WaitForTransactionReceiptErrorType),
        })
      );
  };

    const isPending = mutation.isPending || wait.isPending;

  return {
    error: mutation.error || wait.error,
    isSuccess: wait.isSuccess,
    isPending,
    mutation,
    write,
    wait
  };
};
`;
    fs.mkdirSync(folder, { recursive: true });
    prettier
      .format(content.trim(), {
        parser: "typescript",
        plugins: [typescriptParser, babelParser],
      })
      .then((prettifiedCode) => {
        fs.writeFileSync(filePath, prettifiedCode);
        // fs.chmodSync(filePath, 0o444);
        console.log(`File created: ${filePath}`);
      });
  };
  writeFns.forEach(createWriteFn.bind(null, false));

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
})();
