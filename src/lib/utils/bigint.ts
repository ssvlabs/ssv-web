import { cloneDeepWith } from 'lodash';

type NoBigints<T> = {
  [K in keyof T]: T[K] extends bigint ? string : T[K] extends bigint ? NoBigints<T[K]> : T[K];
};

/**
 * Converts bigints to strings in an object or array.
 * @param anything - The object or array to convert.
 * @returns A new object or array with bigints converted to strings.
 * @example
 * stringifyBigints(1n) → "1"
 * stringifyBigints([1n]) → ["1"]
 * stringifyBigints({a: 1n, b: { c: 1n }}) → {a: "1", b: {c: "1"}}
 */

export const stringifyBigints = <T>(anything: T): NoBigints<T> => {
  return cloneDeepWith(anything, (value) => {
    if (typeof value === 'bigint') return value.toString();
  });
};
