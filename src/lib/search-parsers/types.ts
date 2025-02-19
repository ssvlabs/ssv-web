import type { ParserBuilder } from "nuqs";

export type InferParserBuilderType<T> =
  T extends ParserBuilder<infer U> ? U : never;

// Type that maps over the object and extracts the generic types
export type InferredSearchFilters<T> = {
  [K in keyof T]: InferParserBuilderType<T[K]> | null | undefined;
};
