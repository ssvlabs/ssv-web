/* eslint-disable @typescript-eslint/ban-types */
import type { RouteObject } from "react-router-dom";

type ExtractPaths<T extends RouteObject | RouteObject[]> =
  T extends RouteObject[]
    ? ExtractPaths<T[number]>
    : T extends { path: infer P; children?: infer C }
      ? P extends string
        ?
            | P
            | (C extends RouteObject[]
                ? `${P}/${ExtractPaths<C> extends string ? ExtractPaths<C> : never}`
                : never)
        : never
      : never;

type ExtractParts<P> = P extends `${infer Start}:${string}/${infer Rest}`
  ? `${Start}${string}/${Rest}` | `${Start}${string}/${Rest}/*`
  : P extends `${infer Start}:${string}`
    ? `${Start}${string}/` | `${Start}${string}/*`
    : P;

type ExtractPaths2<T extends RouteObject | RouteObject[]> =
  T extends RouteObject[]
    ? ExtractPaths2<T[number]>
    : T extends { path: infer P; children?: infer C }
      ? ExtractParts<
          | P
          | (C extends RouteObject[]
              ? P extends string
                ? `${P extends `:${string}` ? string : P}/${ExtractPaths<C> extends string ? ExtractPaths<C> : never}`
                : never
              : never)
        >
      : never;

export type RoutePaths<T extends RouteObject | RouteObject[]> =
  | ExtractPaths<T>
  | (string & {});
export type WritableRoutePaths<T extends RouteObject | RouteObject[]> =
  ExtractPaths2<T>;
