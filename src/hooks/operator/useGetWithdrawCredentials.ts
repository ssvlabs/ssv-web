import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { useQuery } from "@tanstack/react-query";
import type { WithdrawCredentialResponse } from "@/api/validators.ts";
import { getValidatorsWithdrawCredentials } from "@/api/validators.ts";

export const useGetWithdrawCredentials = ({
  setIsWithdrawalInputDisabled,
  setWithdrawCredentials,
}: {
  setIsWithdrawalInputDisabled?: (res: boolean) => void;
  setWithdrawCredentials?: (res: string) => void;
}) => {
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
      if (setWithdrawCredentials) {
        setWithdrawCredentials(
          res.withdraw_credentials?.slice(26)
            ? `0x${res.withdraw_credentials?.slice(26)}`
            : "",
        );
      }
      if (setIsWithdrawalInputDisabled) {
        setIsWithdrawalInputDisabled(!!res.withdraw_credentials);
      }
      return {
        withdraw_credentials: res.withdraw_credentials
          ? `0x${res.withdraw_credentials?.slice(26)}`
          : res.withdraw_credentials,
      };
    },
  });
};
