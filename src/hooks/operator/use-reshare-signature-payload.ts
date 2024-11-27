import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard.tsx";
import type { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getOwnerNonce } from "@/api/account.ts";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config.ts";
import { isAddress } from "viem";
import { hexlify } from "ssv-keys/dist/tsc/src/lib/helpers/web3.helper";
import type { MessageData } from "@/lib/utils/dkg.ts";
import { getSignaturePayload } from "@/lib/utils/dkg.ts";

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
      // const operatorIDs = context.dkgReshareState.operators.map(
      //   (operator) => operator.id,
      // );
      const nonce = await getOwnerNonce(ownerAddress);
      const chainId = getChainId(config);
      // const network =
      //   chainId === 1 ? "mainnet" : getChainName(chainId)?.toLowerCase();
      // const operatorsInfo = getOperatorsData(
      //   Array.from(
      //     new Set([
      //       ...context.dkgReshareState.operators,
      //       ...context.dkgReshareState.newOperators,
      //     ]),
      //   ),
      // );

      // const message
      // const message: {
      //   operatorIDs: number[];
      //   newOperatorIDs?: number[];
      //   withdrawAddress: Address;
      //   owner: Address;
      //   nonce: number;
      //   network: string;
      //   proofsString?: string;
      //   operatorsInfo: { id: number; public_key: string; ip: string }[];
      // } = {
      //   operatorIDs,
      //   withdrawAddress,
      //   owner: ownerAddress,
      //   nonce,
      //   network: network as string,
      //   operatorsInfo,
      // };
      //
      // if (context.dkgReshareState.newOperators.length > 0) {
      //   message.newOperatorIDs = context.dkgReshareState.newOperators.map(
      //     (operator) => operator.id,
      //   );
      // }
      // type MessageData = {
      //   publicKey: string;
      //   oldOperators: OperatorApiType[];
      //   newOperators?: OperatorApiType[];
      //   chainId: string;
      //   withdrawalCredentials: Address;
      //   ownerAddress: Address;
      //   nonce: number;
      //   amount: number;
      // };
      // console.log(proofsQuery);
      // console.log(context);
      console.log(nonce);
      const payload = proofsQuery.data?.validators.map(
        ({ publicKey, proofs }) => ({
          messageData: {
            publicKey,
            oldOperators: context.dkgReshareState.operators,
            chainId: hexlify(chainId),
            withdrawalCredentials: withdrawAddress,
            ownerAddress,
            nonce,
          } as MessageData,
          proofs: proofs,
        }),
      );
      // console.log(payload);
      if (payload) {
        getSignaturePayload(payload);
      }
      // console.log(payload);
      // if (payload) {
      //   encodeToSSZ(payload);
      // }
      // console.log(encodeToSSZ(payload));
      return "signature";
    },
  });
};
