import type { ExtendedColumnSort } from "@/types/data-table";
import { type Row } from "@tanstack/react-table";
import { type Parser } from "node_modules/nuqs/dist/_tsup-dts-rollup";
import { createParser, parseAsStringLiteral } from "nuqs";
import { z } from "zod";

export function safeParse<T>(
  parser: Parser<T>["parse"],
  value: string,
  key?: string,
) {
  try {
    return parser(value);
  } catch (error) {
    console.warn(
      "[nuqs] Error while parsing value `%s`: %O" +
        (key ? " (for key `%s`)" : ""),
      value,
      error,
      key,
    );
    return null;
  }
}

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

type TupleParserOptions<T extends z.ZodTuple> = {
  postParse?: (values: z.infer<T>) => z.infer<T>;
  preSerialize?: (values: z.infer<T>) => z.infer<T>;
};
export const parseAsTuple = <T extends z.ZodTuple>(
  tuple: T,
  { postParse, preSerialize }: TupleParserOptions<T> = {},
) => {
  return createParser<z.infer<T>>({
    parse: (value) => {
      try {
        const converted = value.split(",");
        const values = tuple.parse(converted);
        return postParse?.(values) ?? values;
      } catch {
        return null;
      }
    },
    serialize: (values: z.infer<T>) => {
      return (preSerialize?.(values) || values).join(",");
    },
    eq: (a, b) => a[0] === b[0] && a[1] === b[1],
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

export function parseAsUniqueArrayOf<ItemType>(
  itemParser: Parser<ItemType>,
  separator = ",",
) {
  const itemEq = itemParser.eq ?? ((a: ItemType, b: ItemType) => a === b);
  const encodedSeparator = encodeURIComponent(separator);

  return createParser({
    parse: (query) => {
      if (query === "") return [] as ItemType[];

      const parsed = query
        .split(separator)
        .map((item, index) =>
          safeParse(
            itemParser.parse,
            item.replaceAll(encodedSeparator, separator),
            `[${index}]`,
          ),
        )
        .filter((value) => value !== null && value !== undefined);

      return [...new Set(parsed)] as ItemType[];
    },
    serialize: (values) =>
      values
        .map<string>((value) => {
          const str = itemParser.serialize
            ? itemParser.serialize(value)
            : String(value);
          return str.replaceAll(separator, encodedSeparator);
        })
        .join(separator),
    eq(a, b) {
      if (a === b) {
        return true; // Referentially stable
      }
      if (a.length !== b.length) {
        return false;
      }
      return a.every((value, index) => itemEq(value, b[index]!));
    },
  });
}

export const parseAsSorter = <T extends string>(sortableFields: T[]) => {
  const orders = ["asc", "desc"] as const;

  const sortOptions = sortableFields.flatMap((field) =>
    orders.map((order) => `${field}:${order}`),
  ) as `${T}:${(typeof orders)[number]}`[];

  return parseAsStringLiteral(sortOptions);
};
