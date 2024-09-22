import { useAccount } from "@/hooks/account/use-account";
import { useTransactionModal } from "@/signals/modal";
import { useIsMutating } from "@tanstack/react-query";

/**
 * Hook to manage transaction states in the application.
 * @returns An object containing various transaction states.
 */
export const useActiveTransactionState = () => {
  const account = useAccount();

  const isWriting = Boolean(
    useIsMutating({
      mutationKey: ["writeContract"],
    }),
  );

  const isWaiting =
    Boolean(
      useIsMutating({
        mutationKey: ["waitForTransactionReceipt"],
      }),
    ) && !account.isContract;

  const { isOpen } = useTransactionModal();

  return {
    /**
     * Indicates if any transaction-related operation is in progress.
     * This is true for all states: sending the transaction to the user,
     * waiting for user confirmation, and waiting for the transaction receipt.
     */
    isPending: isOpen || isWriting || isWaiting,

    /**
     * Indicates the state when we're sending the transaction to the user
     * and waiting for the transaction hash.
     * This is active from when the transaction is sent to MetaMask until we receive the tx hash.
     */
    isWriting,

    /**
     * Indicates the state after we've received the transaction hash and are waiting for the receipt,
     * or when additional server-side validation is occurring.
     * This state remains true while:
     * 1. Waiting for the transaction receipt from the blockchain
     * 2. Performing additional requests to the CC server for validation
     * 3. The transaction modal is open (which may indicate ongoing server-side processes)
     */
    isWaiting: isOpen || isWaiting,
  };
};
