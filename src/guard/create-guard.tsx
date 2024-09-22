/* eslint-disable react-hooks/rules-of-hooks */
import type { AppRoutePaths } from "@/app/routes/router";
import { reset } from "@/lib/utils/valtio";
import type { ReactNode } from "react";
import React, { useMemo } from "react";
import type { Location, Params, PathMatch } from "react-router";
import { useLocation, matchPath, Navigate, useParams } from "react-router";
import { useUnmount } from "react-use";
import { proxy, useSnapshot } from "valtio";

type GuardFn<T extends object> = (
  state: T,
  options: {
    location: Location;
    params: Readonly<Params<string>>;
    resetState: () => void;
    match: PathMatch<string>;
  },
) => string | void;

export const createGuard = <T extends object>(
  defaultState: T,
  guard: Partial<Record<AppRoutePaths, GuardFn<T>>> = {},
  resetStateOnUnmount = true,
) => {
  const state = proxy<T>(defaultState);
  const resetState = reset.bind(null, state, defaultState);

  const hook = () => useSnapshot(state) as T;
  hook.state = state;

  const guardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const params = useParams();
    const location = useLocation();
    const guards = useMemo(() => Object.entries(guard), []);

    resetStateOnUnmount && useUnmount(resetState);

    for (const [pattern, guardFn] of guards) {
      const match = matchPath(pattern, location.pathname);
      if (!match) continue;
      const path = guardFn?.(state, {
        location,
        params,
        match,
        resetState,
      });
      if (path) return <Navigate to={path} replace />;
    }

    return <>{children}</>;
  };

  return [guardProvider, hook] as const;
};
