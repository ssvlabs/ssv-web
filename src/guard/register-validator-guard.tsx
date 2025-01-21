import type { ClusterSize } from "@/components/operator/operator-picker/operator-cluster-size-picker";
import { createGuard } from "@/guard/create-guard";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useMemo } from "react";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { sortNumbers } from "@/lib/utils/number";
import { useKeysharesSchemaValidation } from "@/hooks/keyshares/use-keyshares-schema-validation";
import type { KeySharesPayload } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/KeySharesPayload";
import { getOSName } from "@/lib/utils/os";
import { createFileSetter } from "@/lib/utils/valtio";
import { isFrom } from "@/lib/utils/router.ts";

const startingRoutes = ["online", "offline", "keyshares", "select-operators"];

export const [RegisterValidatorGuard, useRegisterValidatorContext] =
  createGuard(
    {
      started: false,

      clusterSize: 4 as ClusterSize,
      shares: [] as KeySharesPayload[],

      selectedValidatorsCount: 0,
      depositAmount: 0n,
      fundingDays: 730,
      selectedInitialFundingPeriod: "year" as "year" | "half-year" | "custom",

      keystoresFile: createFileSetter(),
      keysharesFile: createFileSetter(),

      _selectedOperatorsIds: [] as number[],
      set selectedOperatorsIds(ids: number[]) {
        this._selectedOperatorsIds = ids;
      },
      get selectedOperatorsIds() {
        return sortNumbers(
          this._selectedOperatorsIds.slice(0, this.clusterSize),
        );
      },
      get hasSelectedOperators() {
        return this.selectedOperatorsIds.length > 0;
      },

      dkgCeremonyState: {
        validatorsAmount: 1,
        withdrawalAddress: "",
        selectedOs: getOSName(),
      },
    },
    {
      "/join/validator": (_, { resetState }) => {
        resetState();
      },
      "/join/validator/:clusterHash/distribution-method": (
        _,
        { resetState },
      ) => {
        resetState();
      },
      "/join/validator/:clusterHash/keyshares": (state) => {
        state.keysharesFile = createFileSetter();
      },
      "/join/validator/keyshares": (state) => {
        state.keysharesFile = createFileSetter();
      },
      "/join/validator/:nested/*": (state, { match }) => {
        if (state.started) return;

        const inCluster = match.params.nested?.startsWith("0x");
        const activeRoute = inCluster ? match.params["*"] : match.params.nested;

        if (inCluster && activeRoute === "distribution-method") return;

        if (!state.started && startingRoutes.includes(activeRoute ?? "")) {
          state.started = true;
          return;
        }

        return inCluster
          ? `/join/validator/${match.params.nested}/distribution-method`
          : `/join/validator`;
      },
      "*": () => {
        if (isFrom("/join/validator/success")) {
          return "/join/validator";
        }
      },
    },
  );

export const useSelectedOperatorIds = () => {
  const inCluster = Boolean(useClusterPageParams().clusterHash);
  const cluster = useCluster();

  const { hasSelectedOperators, selectedOperatorsIds, keysharesFile } =
    useRegisterValidatorContext();

  const { data: shares } = useKeysharesSchemaValidation(
    keysharesFile.files?.at(0) || null,
  );

  return useMemo(() => {
    return sortNumbers(
      inCluster
        ? cluster.data?.operators ?? []
        : hasSelectedOperators
          ? selectedOperatorsIds
          : shares?.[0].payload.operatorIds ?? [],
    );
  }, [
    inCluster,
    cluster.data?.operators,
    hasSelectedOperators,
    selectedOperatorsIds,
    shares,
  ]);
};
