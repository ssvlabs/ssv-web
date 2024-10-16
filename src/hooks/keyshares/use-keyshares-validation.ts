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
import { useChainId } from "wagmi";

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
  const chainId = useChainId();

  const query = useQuery({
    queryKey: [
      "keyshares-validation",
      file,
      file?.lastModified,
      operatorIds,
      chainId,
    ],
    queryFn: async () => {
      const shares = await createKeysharesFromFile(file!);
      const ids = validateConsistentOperatorIds(shares);
      ensureValidatorsUniqueness(shares);

      const selectedOperatorIds = operatorIds.length ? operatorIds : ids;

      if (!isEqual(sortNumbers(ids), sortNumbers(selectedOperatorIds))) {
        throw new KeysharesValidationError(
          KeysharesValidationErrors.DifferentCluster,
        );
      }

      await Promise.all(
        shares.map((share) =>
          share.validateSingleShares(share.payload.sharesData, {
            ownerAddress: share.data.ownerAddress || "",
            ownerNonce: share.data.ownerNonce || 0,
            publicKey: share.data.publicKey || "",
          }),
        ),
      );

      const operators = await queryFetchOperators(selectedOperatorIds)
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

      validateConsistentOperatorPublicKeys(shares, operators);

      return shares;
    },
    retry: false,
    ...options,
    enabled: isEnabled,
  });
  return query;
};
