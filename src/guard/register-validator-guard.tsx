import type { ClusterSize } from "@/components/operator/operator-picker/operator-cluster-size-picker";
import { createGuard } from "@/guard/create-guard";
import { ref } from "valtio";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useMemo } from "react";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { sortNumbers } from "@/lib/utils/number";
import { useKeysharesSchemaValidation } from "@/hooks/keyshares/use-keyshares-schema-validation";
import type { KeySharesPayload } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/KeySharesPayload";
import { getOSName } from "@/lib/utils/os";
import { isFrom } from "@/lib/utils/router";
import { createFileSetter } from "@/lib/utils/valtio";

const allowedClusterRoutes = ["distribution-method", "online", "offline"];

export const [RegisterValidatorGuard, useRegisterValidatorContext] =
  createGuard(
    {
      flow: "" as
        | "generate-new-keyshares"
        | "generate-from-existing-keyshares"
        | "",
      clusterSize: 4 as ClusterSize,
      shares: [] as KeySharesPayload[],

      selectedValidatorsCount: 0,
      depositAmount: 0n,
      fundingDays: 365,

      keystoresFile: createFileSetter(),
      keysharesFile: createFileSetter(),

      _files: [] as File[],
      set files(files: File[] | null) {
        this._files.splice(0);
        (files || []).forEach((file) => this._files.push(ref(file)));
      },

      get files() {
        return this._files;
      },

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
      "/join/validator/:nested/*": (state, { match }) => {
        if (state.flow) return;
        if (!match.params.nested) return;

        const inCluster = match.params.nested?.startsWith("0x");
        if (inCluster) {
          if (allowedClusterRoutes.includes(match.params["*"] ?? "")) {
            state.flow = "generate-from-existing-keyshares";
            return;
          }
          return `/join/validator/${match.params.nested}/distribution-method`;
        }

        return "/join/validator";
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

  const { hasSelectedOperators, selectedOperatorsIds, files } =
    useRegisterValidatorContext();

  const { data: shares } = useKeysharesSchemaValidation(files?.at(0) || null);

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
