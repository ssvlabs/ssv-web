import { useActiveTransactionState } from "@/hooks/app/use-transaction-state";
import { useBlocker } from "react-router";

export const useBlockNavigationOnPendingTx = () => {
  const state = useActiveTransactionState();
  useBlocker(state.isPending);
};
