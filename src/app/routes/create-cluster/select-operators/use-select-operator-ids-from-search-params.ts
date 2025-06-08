import { globals } from "@/config";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";

const { state } = useRegisterValidatorContext;
const { QUAD_CLUSTER, SEPT_CLUSTER, DECA_CLUSTER, TRISKAIDEKA_CLUSTER } =
  globals.CLUSTER_SIZES;
export const useSelectOperatorIdsFromSearchParams = () => {
  const [ids, setIds] = useQueryState(
    "id",
    parseAsArrayOf(parseAsInteger).withOptions({
      history: "replace",
    }),
  );
  useEffect(() => {
    if (ids?.length) {
      const sortedIds = ids.sort((a, b) => a - b);
      if (sortedIds.length <= QUAD_CLUSTER) {
        state.selectedOperatorsIds = sortedIds;
        state.clusterSize = QUAD_CLUSTER;
      } else if (sortedIds.length <= SEPT_CLUSTER) {
        state.selectedOperatorsIds = sortedIds;
        state.clusterSize = SEPT_CLUSTER;
      } else if (sortedIds.length <= DECA_CLUSTER) {
        state.selectedOperatorsIds = sortedIds;
        state.clusterSize = DECA_CLUSTER;
      } else {
        state.selectedOperatorsIds = sortedIds.slice(0, TRISKAIDEKA_CLUSTER);
        state.clusterSize = TRISKAIDEKA_CLUSTER;
      }
      setIds(null);
    }
  }, [ids, setIds]);
};
