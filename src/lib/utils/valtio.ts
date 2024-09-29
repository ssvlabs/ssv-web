import { tryCatch } from "@/lib/utils/tryCatch";
import { cloneDeep } from "lodash-es";
import { proxy, ref, subscribe, useSnapshot } from "valtio";

export const reset = <T extends object>(state: T, defaultState: T) => {
  const resetObj = cloneDeep(defaultState);
  Object.entries(resetObj).forEach(([key, value]) => {
    // @ts-expect-error - This is a valid assignment
    state[key] = value;
  });
};

type ProxyOptions<T> = {
  onChange?: (state: T) => void;
};

export const createPersistedProxyHook = <T extends object>(
  key: string,
  defaultState: T,
  options: ProxyOptions<T> = {},
) => {
  const state = proxy<T>(
    tryCatch(() => JSON.parse(localStorage.getItem(key) ?? ""), defaultState),
  );

  options.onChange?.(state);

  subscribe(state, () => {
    options.onChange?.(state);
    localStorage.setItem(key, JSON.stringify(state));
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hook = () => useSnapshot(state);
  hook.state = state;
  return hook;
};

export const createFileSetter = () => ({
  _files: [] as File[],
  set files(files: File[] | null) {
    this._files.splice(0);
    (files || []).forEach((file) => this._files.push(ref(file)));
  },

  get files(): File[] | null {
    return this._files || null;
  },
});
