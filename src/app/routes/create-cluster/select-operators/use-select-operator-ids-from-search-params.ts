import { globals } from "@/config";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { useOperators } from "@/hooks/operator/use-operators";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";

const { state } = useRegisterValidatorContext;
const { QUAD_CLUSTER, SEPT_CLUSTER, DECA_CLUSTER, TRISKAIDEKA_CLUSTER } =
  globals.CLUSTER_SIZES;
export const useSelectOperatorIdsFromSearchParams = () => {
  const [searchIds, setSearchIds] = useQueryState(
    "id",
    parseAsArrayOf(parseAsInteger).withOptions({
      history: "replace",
    }),
  );

  const operators = useOperators(searchIds || []);

  useEffect(() => {
    if (operators.data?.length && searchIds?.length) {
      const ids = operators.data
        .filter(({ is_deleted }) => !is_deleted)
        .map(({ id }) => id)
        .sort((a, b) => a - b);

      if (!ids.length) return console.log("No operators");

      if (ids.length <= QUAD_CLUSTER) {
        state.selectedOperatorsIds = ids;
        state.clusterSize = QUAD_CLUSTER;
      } else if (ids.length <= SEPT_CLUSTER) {
        state.selectedOperatorsIds = ids;
        state.clusterSize = SEPT_CLUSTER;
      } else if (ids.length <= DECA_CLUSTER) {
        state.selectedOperatorsIds = ids;
        state.clusterSize = DECA_CLUSTER;
      } else {
        state.selectedOperatorsIds = ids.slice(0, TRISKAIDEKA_CLUSTER);
        state.clusterSize = TRISKAIDEKA_CLUSTER;
      }
      setSearchIds(null);
    }
  }, [operators.data, searchIds?.length, setSearchIds]);
};
