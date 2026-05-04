import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { useCluster } from "@/hooks/cluster/use-cluster.ts";
import { useOperatorsUsability } from "@/hooks/keyshares/use-operators-usability.ts";
import { useValidateProofs } from "@/hooks/use-validate-proofs.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import type { Operator } from "@/types/api.ts";
import { getOperatorIds } from "@/lib/utils/operator.ts";

export const useReshareDkg = () => {
  const { clusterHash } = useClusterPageParams();
  const account = useAccount();
  const { state } = useBulkActionContext;
  const context = useBulkActionContext();

  const cluster = useCluster(clusterHash!);

  const proofsQuery = useValidateProofs(
    context.dkgReshareState.proofFiles.files || [],
  );

  const setNewDkgOperators = (operators: Operator[]) =>
    (state.dkgReshareState.newOperators = operators);

  const operatorsUsability = useOperatorsUsability({
    account: account.address!,
    operatorIds: getOperatorIds(cluster.data?.operators ?? []),
  });

  return {
    operators: operatorsUsability?.data?.operators ?? [],
    proofsQuery,
    setNewDkgOperators,
  };
};
