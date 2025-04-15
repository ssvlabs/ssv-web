import { createGuard } from "@/guard/create-guard.tsx";

export const [CreateBAppContext, useCreateBAppContext] = createGuard(
  {
    selectedAssets: new Map<number, { token: `0x${string}`; beta: string }>(),
    addAsset(index: number, token: `0x${string}`) {
      this.selectedAssets.set(index, { token, beta: "" });
    },
    setAsset(index: number, asset: { token: `0x${string}`; beta: string }) {
      this.selectedAssets.set(index, asset);
    },
    getAsset(index: number) {
      return this.selectedAssets.get(index);
    },
    deleteSelectedAsset(index: number) {
      return this.selectedAssets.delete(index);
    },
    bAppAddress: "" as `0x${string}`,
    metadataLink: "",
  },
  {},
  false,
);
