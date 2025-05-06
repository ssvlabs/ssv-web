import type { ExtendedColumnSort } from "@/types/data-table";
import { type Row } from "@tanstack/react-table";
import { createParser, parseAsStringLiteral } from "nuqs/server";
import { z } from "zod";

export const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

/**
 * Creates a parser for TanStack Table sorting state.
 * @param originalRow The original row data to validate sorting keys against.
 * @returns A parser for TanStack Table sorting state.
 */

export const serializeSortingState = <T extends ExtendedColumnSort<never>[]>(
  sorting: T,
) =>
  sorting.map((sort) => `${sort.id}:${sort.desc ? "desc" : "asc"}`).join(",");

export const getSortingStateParser = <TData>(
  originalRow?: Row<TData>["original"],
) => {
  const validKeys = originalRow ? new Set(Object.keys(originalRow)) : null;

  return createParser<ExtendedColumnSort<TData>[]>({
    parse: (value) => {
      try {
        const [id, order] = value.split(":");
        if (!id || !order) return null;

        const desc = order === "desc";

        const result = z.array(sortingItemSchema).safeParse([{ id, desc }]);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }
        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => serializeSortingState(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc,
      ),
  });
};
export const parseAsTuple = <T extends [z.ZodTypeAny, ...z.ZodTypeAny[]]>(
  tuple: T,
  preParse: (values: string[]) => string[] = (values) => values,
) => {
  return createParser({
    parse: (value) => {
      try {
        const values = preParse(value.split(",").slice(0, tuple.length));
        return z.tuple(tuple).parse(values);
      } catch {
        return null;
      }
    },
    serialize: (value) => value.join(","),
    eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
};

export const parseAsNumberEnum = <T extends [number, ...number[]]>(
  enumValues: T,
) => {
  return createParser<T[number]>({
    parse: (value) => {
      if (!value) return null;
      const parsed = parseInt(value);
      if (isNaN(parsed)) return null;
      if (!enumValues.includes(parsed)) return null;
      return parsed;
    },
    serialize: (value) => value.toString(),
    eq: (a, b) => a === b,
  });
};

export const parseAsSorter = <T extends string>(sortableFields: T[]) => {
  const orders = ["asc", "desc"] as const;

  const sortOptions = sortableFields.flatMap((field) =>
    orders.map((order) => `${field}:${order}`),
  ) as `${T}:${(typeof orders)[number]}`[];

  return parseAsStringLiteral(sortOptions);
};
