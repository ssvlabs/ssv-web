import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard.tsx";
import type { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import type { Operator } from "@/types/api.ts";
import { getOwnerNonce } from "@/api/account.ts";
import { getChainName } from "@/lib/utils/wagmi.ts";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config.ts";
import { isAddress } from "viem";

const getOperatorsData = (operators: Operator[]) => {
  return operators
    .map(({ id, public_key, dkg_address }) => ({
      id,
      public_key,
      ip: dkg_address,
    }))
    .toString();
};

export const useReshareSignaturePayload = ({
  ownerAddress,
  withdrawAddress,
}: {
  ownerAddress: Address;
  withdrawAddress: Address;
}) => {
  const { proofsQuery } = useReshareDkg();
  const context = useRegisterValidatorContext();

  return useQuery({
    queryKey: [ownerAddress, withdrawAddress],
    enabled: isAddress(ownerAddress) && isAddress(withdrawAddress),
    queryFn: async () => {
      const operatorIDs = context.dkgReshareState.operators.map(
        (operator) => operator.id,
      );
      const nonce = await getOwnerNonce(ownerAddress);
      const chainId = getChainId(config);
      const network =
        chainId === 1 ? "mainnet" : getChainName(chainId)?.toLowerCase();
      const operatorsInfo = getOperatorsData(
        Array.from(
          new Set([
            ...context.dkgReshareState.operators,
            ...context.dkgReshareState.newOperators,
          ]),
        ),
      );

      const message: {
        operatorIDs: number[];
        newOperatorIDs?: number[];
        withdrawAddress: Address;
        owner: Address;
        nonce: number;
        network: string;
        proofsString?: string;
        operatorsInfo: string;
      } = {
        operatorIDs,
        withdrawAddress,
        owner: ownerAddress,
        nonce,
        network: network as string,
        operatorsInfo,
      };

      if (context.dkgReshareState.newOperators.length > 0) {
        message.newOperatorIDs = context.dkgReshareState.newOperators.map(
          (operator) => operator.id,
        );
      }
      const payload = proofsQuery.data?.validators.map(({ proofs }) => ({
        message: {
          ...message,
          proofsString: JSON.stringify(proofsQuery.data.proofs),
        },
        proofs: proofs.toString(),
      }));
      console.log(payload);
      // if (payload) {
      //   encodeToSSZ(payload);
      // }
      // console.log(encodeToSSZ(payload));
      return "signature";
    },
  });
};
