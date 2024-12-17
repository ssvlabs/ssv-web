import { createGuard } from "@/guard/create-guard";
import { isFrom } from "@/lib/utils/router";
import { add0x } from "@/lib/utils/strings";
import type { Operator } from "@/types/api.ts";
import { createFileSetter } from "@/lib/utils/valtio.ts";
import { getOSName } from "@/lib/utils/os.ts";

export const [BulkActionGuard, useBulkActionContext] = createGuard(
  {
    _selectedPublicKeys: [] as string[],
    get selectedPublicKeys(): string[] {
      return this._selectedPublicKeys.map(add0x);
    },
    set selectedPublicKeys(keys: string[]) {
      this._selectedPublicKeys = keys;
    },
    dkgReshareState: {
      operators: [] as Operator[],
      newOperators: [] as Operator[],
      proofFiles: createFileSetter(),
      selectedValidatorsCount: 0,
      selectedOs: getOSName(),
    },
  },
  {
    "/clusters/:clusterHash/:action/:status": (state, { match }) => {
      if (isFrom("/clusters/:clusterHash/:action/success")) return "..";
      if (!["exit", "remove"].includes(match.params.action ?? "")) return;
      if (!["confirmation", "success"].includes(match.params.status ?? ""))
        return;
      if (!state.selectedPublicKeys.length) return `..`;
    },
    ...[
      "/clusters/:clusterHash/reshare/select-operators",
      "/clusters/:clusterHash/reshare/summary",
    ].reduce(
      (guards, path) => ({
        ...guards,
        [path]: (
          state: { dkgReshareState: { operators: Operator[] } },
          { match }: { match: { params: { clusterHash: string } } },
        ) => {
          if (state.dkgReshareState.operators.length === 0) {
            return match.params.clusterHash
              ? `/clusters/${match.params.clusterHash}`
              : "clusters";
          }
        },
      }),
      {},
    ),
  },
);
