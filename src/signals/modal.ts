import type { Address } from "abitype";
import { proxy, useSnapshot } from "valtio";

interface ModalProxy<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  isOpen: boolean;
  onOpenChange(open: boolean): void;
  open(meta?: T): void;
  close(clear?: boolean): void;
  meta: Partial<T>;
}

type Effects<T> = {
  meta?: T;
  isOpen?: boolean;
};

const createModalSignal = <T extends Record<string, unknown>>(
  defaults?: Effects<T>,
) => {
  const state = proxy<ModalProxy<T>>({
    isOpen: defaults?.isOpen ?? false,
    onOpenChange: (open) => {
      state.isOpen = open;
    },
    open: (meta) => {
      if (meta) state.meta = meta;
      state.isOpen = true;
    },
    close: (clear) => {
      if (clear) state.meta = {};
      state.isOpen = false;
    },
    meta: defaults?.meta ?? {},
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hook = () => useSnapshot(state);
  hook.state = state;
  return hook;
};

export const useTransactionModal = createModalSignal<{
  hash: string;
  variant?: "default" | "2-step";
  step: "pending" | "indexing";
}>();

export const usePastingLimitExceededModal = createModalSignal();
export const useMultisigTransactionModal = createModalSignal();
export const useAssetDepositModal = createModalSignal<{
  strategyId: string;
  asset: Address;
}>();

export const useAssetWithdrawalModal = createModalSignal<{
  strategyId: string;
  asset: Address;
}>();

export const useFeeEditorModal = createModalSignal<{
  strategyId: string;
}>();

export const useMetadataEditorModal = createModalSignal<{
  strategyId: string;
}>();

export const useOptInModal = createModalSignal<{
  strategyId: string;
}>();

export const useManageObligationsModal = createModalSignal<{
  bAppId: Address;
  strategyId: string;
}>();

export const useObligateModal = createModalSignal<{
  token: Address;
  bAppId: Address;
  strategyId: string;
  obligationUpdateData: {
    isObligated: boolean;
    isPending: boolean;
    isPendingEnd: number;
    isExpired: boolean;
    isWaiting: boolean;
    isFinalizeEnd: number;
  };
}>();
