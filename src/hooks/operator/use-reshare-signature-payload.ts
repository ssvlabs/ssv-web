import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import type { Address } from "viem";
import { getOwnerNonce } from "@/api/account.ts";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config.ts";
import type { MessageData } from "@/lib/utils/dkg.ts";
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
    const chainId = getChainId(config) === 1 ? "0x00000000" : "0x01017000";
    const payload = (proofsQuery.data?.validators || []).map(
      ({ publicKey, proofs }) => ({
        messageData: {
          publicKey,
          oldOperators: context.dkgReshareState.operators,
          chainId,
          withdrawalCredentials: withdrawAddress,
          ownerAddress,
          nonce,
          amount: 32000000000,
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
