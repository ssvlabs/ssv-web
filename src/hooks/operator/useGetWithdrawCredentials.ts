import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { useQuery } from "@tanstack/react-query";
import type { WithdrawCredentialResponse } from "@/api/validators.ts";
import { getValidatorsWithdrawCredentials } from "@/api/validators.ts";

export const useGetWithdrawCredentials = () => {
  const { proofsQuery } = useReshareDkg();
  return useQuery({
    queryKey: [proofsQuery?.data?.validators],
    enabled: !!proofsQuery?.data?.validators,
    queryFn: (): Promise<WithdrawCredentialResponse> =>
      getValidatorsWithdrawCredentials(
        (proofsQuery?.data?.validators || []).map(({ publicKey }) => publicKey),
      ),
  });
};
