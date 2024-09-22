import { isValidatorRegisteredQueryOptions } from "@/hooks/use-is-validator-registered";
import { useSSVAccount } from "@/hooks/use-ssv-account";
import { combineQueryStatus, queryClient } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { add0x } from "@/lib/utils/strings";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { sortBy } from "lodash-es";
import type { KeySharesItem } from "ssv-keys";

export type KeysharesValidatorStatus = "registered" | "incorrect" | "available";

export type ValidatorShareWithStatus = {
  share: KeySharesItem;
  status: KeysharesValidatorStatus;
};

export type TaggedValidators = Record<
  KeysharesValidatorStatus | "all",
  KeySharesItem[]
>;

export const useKeysharesValidatorsList = (
  shares?: KeySharesItem[],
  options: Omit<UseQueryOptions, "queryKey" | "queryFn"> = { enabled: true },
) => {
  const ssvAccount = useSSVAccount({ staleTime: 0 });
  const sortedShares = sortBy(shares, (share) => share.data.ownerNonce);

  const query = useQuery({
    staleTime: ms(1, "minutes"),
    gcTime: ms(1, "minutes"),
    queryKey: ["validators-state", ssvAccount.data?.nonce, sortedShares],
    queryFn: async () => {
      const states = await Promise.all(
        sortedShares.map(async (share) => {
          return queryClient
            .fetchQuery({
              ...isValidatorRegisteredQueryOptions(
                add0x(share.data.publicKey!),
              ),
              staleTime: ms(1, "minutes"),
            })
            .then(() => [share, true] as [KeySharesItem, boolean])
            .catch(() => [share, false] as [KeySharesItem, boolean]);
        }),
      );

      let i = 0;

      const sharesWithStatuses = states.map(([share, isRegistered]) => {
        if (isRegistered) return { share, status: "registered" };

        const validNonce = share.data.ownerNonce === ssvAccount.data!.nonce + i;
        i++;
        return {
          share,
          status: validNonce ? "available" : "incorrect",
        };
      }) as ValidatorShareWithStatus[];

      const tags = sharesWithStatuses.reduce(
        (acc, { share, status }) => {
          acc[status].push(share);
          return acc;
        },
        {
          registered: [],
          incorrect: [],
          available: [],
          all: sortedShares,
        } as TaggedValidators,
      );

      return {
        tags,
        sharesWithStatuses,
      };
    },
    enabled: Boolean(ssvAccount.isSuccess && shares?.length && options.enabled),
  });
  return {
    query: {
      ...query,
      ...combineQueryStatus(query, ssvAccount),
    },
  };
};
