import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { useQuery } from "@tanstack/react-query";
import type { WithdrawCredentialResponse } from "@/api/validators.ts";
import { getValidatorsWithdrawCredentials } from "@/api/validators.ts";

export const useGetWithdrawCredentials = (
  setIsWithdrawalInputDisabled: (res: boolean) => void,
) => {
  const { proofsQuery } = useReshareDkg();
  return useQuery({
    queryKey: [proofsQuery?.data?.validators],
    retry: false,
    staleTime: 0,
    gcTime: 0,
    enabled: !!proofsQuery?.data?.validators,
    queryFn: async (): Promise<WithdrawCredentialResponse> => {
      const res = await getValidatorsWithdrawCredentials(
        (proofsQuery?.data?.validators || []).map(({ publicKey }) => publicKey),
      );
      setIsWithdrawalInputDisabled(!!res.withdraw_credentials);
      return res;
    },
  });
};
