import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { useClusterState } from "@/hooks/cluster/use-cluster-state.ts";
import { useOperatorsUsability } from "@/hooks/keyshares/use-operators-usability.ts";
import { useValidateProofs } from "@/hooks/use-validate-proofs.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import type { Operator } from "@/types/api.ts";

export const useReshareDkg = () => {
  const { clusterHash } = useClusterPageParams();
  const account = useAccount();
  const { state } = useBulkActionContext;
  const context = useBulkActionContext();

  const { cluster } = useClusterState(clusterHash!);

  const proofsQuery = useValidateProofs(
    context.dkgReshareState.proofFiles.files || [],
  );

  const setNewDkgOperators = (operators: Operator[]) =>
    (state.dkgReshareState.newOperators = operators);

  const operatorsUsability = useOperatorsUsability({
    account: account.address!,
    operatorIds: cluster.data?.operators ?? [],
  });

  return {
    operators: operatorsUsability?.data?.operators ?? [],
    proofsQuery,
    setNewDkgOperators,
  };
};
