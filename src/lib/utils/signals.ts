import { signal, Signal } from "@preact/signals-react";
import { useMemo } from "react";

type Reactive<T> = { [K in keyof T]: Signal<T[K]> };

export function reactive<T extends object>(obj: T) {
  const reactive = {} as Reactive<T>;
  for (const i in obj) reactive[i] = signal(obj[i]);
  return reactive;
}

export function useReactive<T extends object>(obj: T) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => reactive(obj), []);
}
