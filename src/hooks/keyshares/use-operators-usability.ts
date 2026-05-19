import { useOperators } from "@/hooks/operator/use-operators";
import { useGetValidatorsPerOperatorLimit } from "@/lib/contract-interactions/hooks/getter";
import type { UseQueryOptions } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { canAccountUseOperator } from "@/lib/utils/operator";
import type { Operator } from "@/types/api";
import type { OperatorID } from "@/types/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { useChainId } from "wagmi";
import { useLocalStorage } from "react-use";

type Props = {
  account: Address;
  operatorIds: OperatorID[];
  additionalValidators?: number;
};

type Result = {
  operators: {
    operator: Operator;
    isUsable: boolean;
    status: string;
  }[];
  hasPermissionedOperators: boolean;
  hasExceededValidatorsLimit: boolean;
  maxAddableValidators: number;
  hasDeletedOperators: boolean;
};

export const useOperatorsUsability = (
  { account, operatorIds, additionalValidators = 0 }: Props,
  { enabled = true, ...options }: UseQueryOptions<Result> = {},
) => {
  const { data: maxValidators = 0 } = useGetValidatorsPerOperatorLimit();
  const operators = useOperators(operatorIds, {
    placeholderData: keepPreviousData,
  });

  const chainId = useChainId();
  const [skipValidation] = useLocalStorage("skipValidatorsMaxCount", false);

  return useQuery({
    staleTime: ms(12, "seconds"),
    gcTime: ms(12, "seconds"),
    queryKey: [
      "canAccountUseOperator",
      operators,
      account,
      maxValidators,
      chainId,
    ],
    queryFn: async () => {
      const result = await Promise.all(
        operators.data!.map(
          async (operator) =>
            [
              operator.id,
              await canAccountUseOperator(account, operator),
            ] as const,
        ),
      );

      const usabilityMap = Object.fromEntries(result);

      return operators.data!.reduce(
        (acc, operator) => {
          const hasExceededValidatorsLimit =
            !skipValidation && operator?.validators_count >= maxValidators;
          const isUsable = usabilityMap[operator.id] ?? false;

          const willExceedValidatorsLimit =
            !skipValidation &&
            operator.validators_count + additionalValidators >= maxValidators;

          acc.operators.push({
            operator,
            isUsable:
              isUsable &&
              !hasExceededValidatorsLimit &&
              !operator.is_deleted &&
              !willExceedValidatorsLimit,
            status: hasExceededValidatorsLimit
              ? "exceeded_validators_limit"
              : !isUsable
                ? "is_permissioned"
                : willExceedValidatorsLimit
                  ? "will_exceed_validators_limit"
                  : "usable",
          });

          acc.hasPermissionedOperators ||= !isUsable;
          acc.hasExceededValidatorsLimit ||= hasExceededValidatorsLimit;
          acc.hasDeletedOperators ||= operator.is_deleted;
          acc.maxAddableValidators = Math.min(
            acc.maxAddableValidators,
            maxValidators - operator.validators_count,
          );
          return acc;
        },
        {
          operators: [],
          hasPermissionedOperators: false,
          hasExceededValidatorsLimit: false,
          maxAddableValidators: Infinity,
          hasDeletedOperators: false,
        } as Result,
      );
    },
    ...options,
    enabled: Boolean(operators.data && enabled),
  });
};
