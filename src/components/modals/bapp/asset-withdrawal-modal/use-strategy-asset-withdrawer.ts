import { useAsset } from "@/hooks/use-asset";
import { useFinalizeWithdrawal } from "@/lib/contract-interactions/b-app/write/use-finalize-withdrawal";
import { useFinalizeWithdrawalETH } from "@/lib/contract-interactions/b-app/write/use-finalize-withdrawal-eth";
import { useProposeWithdrawal } from "@/lib/contract-interactions/b-app/write/use-propose-withdrawal";
import { useProposeWithdrawalETH } from "@/lib/contract-interactions/b-app/write/use-propose-withdrawal-eth";
import type {
  AllEvents,
  MutationOptions,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useMutation } from "@tanstack/react-query";
import type { Address } from "abitype";
import { track } from "@/lib/analytics/mixpanel";

type StrategyAssetWithdrawerProps = {
  strategyId: string;
  asset: Address;
};

export const useStrategyAssetWithdrawer = (
  params: StrategyAssetWithdrawerProps,
) => {
  const proposeWithdrawERC20 = useProposeWithdrawal();
  const proposeWithdrawETH = useProposeWithdrawalETH();

  const finalizeWithdrawalERC20 = useFinalizeWithdrawal();
  const finalizeWithdrawalETH = useFinalizeWithdrawalETH();

  const asset = useAsset(params.asset);

  const request = useMutation({
    mutationFn: async ({
      amount,
      options,
    }: {
      amount: bigint;
      options?: MutationOptions<AllEvents>;
    }) => {
      const proposer = asset.isEthereum
        ? proposeWithdrawETH
        : proposeWithdrawERC20;

      return proposer
        .write(
          {
            strategyId: Number(params.strategyId),
            token: params.asset,
            amount: amount || BigInt(0),
          },
          options,
        )
        .then((args) => {
          track("Request withdrawal");
          return args;
        });
    },
  });

  const finalize = useMutation({
    mutationFn: async ({
      options,
    }: {
      options?: MutationOptions<AllEvents>;
    }) => {
      const finalizer = asset.isEthereum
        ? finalizeWithdrawalETH
        : finalizeWithdrawalERC20;

      return finalizer
        .write(
          {
            strategyId: Number(params.strategyId),
            token: params.asset,
          },
          options,
        )
        .then((args) => {
          track("Execute withdrawal");
          return args;
        });
    },
  });

  return {
    request,
    finalize,
  };
};
