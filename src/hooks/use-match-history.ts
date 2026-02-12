import { useLocationState } from "@/app/routes/router";
import { useMemo } from "react";
import { matchPath } from "react-router";

export function useMatchHistory(pattern: string) {
  const state = useLocationState();

  return useMemo(() => {
    return [...state.history]
      .reverse()
      .find((location) => matchPath(pattern, location.pathname));
  }, [pattern, state.history]);
}
