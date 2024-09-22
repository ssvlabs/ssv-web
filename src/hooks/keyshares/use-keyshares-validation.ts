import { useSelectedOperatorIds } from "@/guard/register-validator-guard";
import { createKeysharesFromFile } from "@/hooks/keyshares/use-keyshares-schema-validation";
import { queryFetchOperators } from "@/hooks/operator/use-operators";
import type { UseQueryOptions } from "@/lib/react-query";
import { KeysharesValidationError } from "@/lib/utils/keyshares";
import {
  ensureValidatorsUniqueness,
  KeysharesValidationErrors,
  validateConsistentOperatorIds,
  validateConsistentOperatorPublicKeys,
} from "@/lib/utils/keyshares";
import { sortNumbers } from "@/lib/utils/number";
import { useQuery } from "@tanstack/react-query";
import { isEqual } from "lodash-es";
import type { KeySharesItem } from "ssv-keys";

export const useKeysharesValidation = (
  file: File | null,
  options: UseQueryOptions<
    KeySharesItem[],
    Error | KeysharesValidationError
  > = {
    enabled: true,
  },
) => {
  const operatorIds = useSelectedOperatorIds();
  const isEnabled = Boolean(file && options.enabled);

  const query = useQuery({
    queryKey: ["keyshares-validation", file, file?.lastModified, operatorIds],
    queryFn: async () => {
      const shares = await createKeysharesFromFile(file!);
      const ids = validateConsistentOperatorIds(shares);
      ensureValidatorsUniqueness(shares);

      if (!isEqual(sortNumbers(ids), sortNumbers(operatorIds))) {
        throw new KeysharesValidationError(
          KeysharesValidationErrors.DifferentCluster,
        );
      }

      const operators = await queryFetchOperators(operatorIds)
        .then((operators) => {
          if (operators.some((operator) => operator.is_deleted)) {
            throw new KeysharesValidationError(
              KeysharesValidationErrors.OPERATOR_NOT_EXIST_ID,
            );
          }
          return operators;
        })
        .catch(() => {
          throw new KeysharesValidationError(
            KeysharesValidationErrors.OPERATOR_NOT_EXIST_ID,
          );
        });
      console.log("operators:", operators);

      validateConsistentOperatorPublicKeys(shares, operators);

      return shares;
    },
    retry: false,
    ...options,
    enabled: isEnabled,
  });
  return query;
};
