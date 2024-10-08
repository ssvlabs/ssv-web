import type { RouteObject } from "react-router";

export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

export type Paths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? `${K}` | Join<K, Paths<T[K]>>
        : never;
    }[keyof T]
  : "";

export type ExtractPaths<T> = T extends {
  path?: string;
  children?: RouteObject[];
}
  ?
      | T["path"]
      | (T["children"] extends RouteObject[]
          ? Join<T["path"], ExtractPaths<T["children"][number]>>
          : never)
  : "";

export type Leaves<T> = T extends object
  ? {
      [K in keyof T]-?: Join<K, Leaves<T[K]>>;
    }[keyof T]
  : "";
