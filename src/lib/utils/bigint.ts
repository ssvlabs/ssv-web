import { cloneDeepWith, isUndefined } from "lodash-es";
import { parseUnits } from "viem";

export const bigintMax = (...args: (bigint | undefined)[]): bigint => {
  return args
    .filter((x) => !isUndefined(x))
    .reduce((max, cur) => (cur > max ? cur : max), BigInt(0));
};

export const bigintMin = (...args: (bigint | undefined)[]): bigint => {
  return args
    .filter((x) => !isUndefined(x))
    .reduce((min, cur) => (cur < min ? cur : min));
};
export const bigintRound = (value: bigint, precision: bigint): bigint => {
  const remainder = value % precision;
  return remainder >= precision / 2n
    ? value + (precision - remainder) // Round up
    : value - remainder; // Round down
};

export const bigintFloor = (value: bigint, precision = 10_000_000n): bigint => {
  return value - (value % precision);
};

export const bigintAbs = (n: bigint) => (n < 0n ? -n : n);

/**
 * Checks if the difference between two bigints exceeds a specified tolerance.
 *
 * @param {bigint} a - The first bigint value.
 * @param {bigint} b - The second bigint value.
 * @param {bigint} [tolerance] - default is `parseUnits("0.0001", 18)`.
 */
export const isBigIntChanged = (
  a: bigint,
  b: bigint,
  tolerance = parseUnits("0.0001", 18),
): boolean => {
  return bigintAbs(a - b) > tolerance;
};

export const roundOperatorFee = (
  fee: bigint,
  precision = 10_000_000n,
): bigint => {
  return bigintRound(fee, precision);
};

type NoBigints<T> = {
  [K in keyof T]: T[K] extends bigint
    ? string
    : T[K] extends bigint
      ? NoBigints<T[K]>
      : T[K];
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
    if (typeof value === "bigint") return value.toString();
  });
};

export const bigintifyNumbers = (
  numbers: readonly number[] | number[],
): bigint[] => {
  return cloneDeepWith(numbers, (value) => {
    if (typeof value === "number") return BigInt(value);
  });
};
