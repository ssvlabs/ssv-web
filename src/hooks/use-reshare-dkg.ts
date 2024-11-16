import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { useClusterState } from "@/hooks/cluster/use-cluster-state.ts";
import { useOperatorsUsability } from "@/hooks/keyshares/use-operators-usability.ts";
import { useValidateProofs } from "@/hooks/use-validate-proofs.ts";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard.tsx";
// import { useQuery } from "@tanstack/react-query";

export const useReshareDkg = () => {
  const { clusterHash } = useClusterPageParams();
  const account = useAccount();
  const context = useRegisterValidatorContext();

  const { cluster } = useClusterState(clusterHash!);

  const proofsQuery = useValidateProofs(
    context.dkgReshareState.proofFiles.files || [],
  );

  const operatorsUsability = useOperatorsUsability({
    account: account.address!,
    operatorIds: cluster.data?.operators ?? [],
  });

  return { operators: operatorsUsability?.data?.operators ?? [], proofsQuery };
};
