import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import type { Address } from "viem";
import { getOwnerNonce } from "@/api/account.ts";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config.ts";
import type { MessageData } from "@/lib/utils/dkg.ts";
import { FORKS } from "@/lib/utils/dkg.ts";
import { DEFAULT_AMOUNT } from "@/lib/utils/dkg.ts";
import { getSignaturePayload } from "@/lib/utils/dkg.ts";
import { useSignMessage } from "wagmi";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";

export const useReshareSignaturePayload = ({
  ownerAddress,
  withdrawAddress,
}: {
  ownerAddress: Address;
  withdrawAddress: Address;
}) => {
  const { proofsQuery } = useReshareDkg();
  const context = useBulkActionContext();
  const sign = useSignMessage();

  const getSignature = async () => {
    const nonce = await getOwnerNonce(ownerAddress);
    const chainId = FORKS[getChainId(config)];
    const payload = (proofsQuery.data?.validators || []).map(
      ({ publicKey, proofs }) => ({
        messageData: {
          publicKey,
          oldOperators: context.dkgReshareState.operators,
          chainId,
          withdrawalCredentials: withdrawAddress,
          ownerAddress,
          nonce,
          amount: DEFAULT_AMOUNT,
        } as MessageData,
        proofs: proofs,
      }),
    );

    return sign.signMessageAsync({
      message: getSignaturePayload(payload),
    });
  };
  return { getSignature, isLoading: sign.isPending };
};
