import type { AllEvents } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { setOptimisticData } from "@/lib/react-query";
import type { Operator } from "@/types/api";

const patchOperator = (operatorId: number, patch: Partial<Operator>) => {
  setOptimisticData(
    getOperatorQueryOptions(operatorId).queryKey,
    (operator) => {
      if (!operator) return operator;
      return { ...operator, ...patch };
    },
  );
};

export const applyOptimisticOperatorUpdate = (
  operatorId: number,
  events: AllEvents[],
) => {
  for (const event of events) {
    switch (event.eventName) {
      case "OperatorRemoved":
        patchOperator(operatorId, { is_deleted: true, status: "Removed" });
        return;

      case "OperatorFeeExecuted":
        patchOperator(operatorId, {
          eth_fee: event.args.fee.toString(),
        });
        return;

      case "OperatorFeeDeclared":
        patchOperator(operatorId, {
          declared_fee: event.args.fee.toString(),
        });
        return;

      case "OperatorFeeDeclarationCancelled":
        patchOperator(operatorId, { declared_fee: "0" });
        return;

      case "OperatorPrivacyStatusUpdated":
        patchOperator(operatorId, {
          is_private: event.args.toPrivate,
        });
        return;

      case "OperatorWhitelistingContractUpdated":
        patchOperator(operatorId, {
          whitelisting_contract: event.args.whitelistingContract,
        });
        return;
    }
  }
};
