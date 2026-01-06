import { formatUnits } from "viem";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 0,
  compactDisplay: "short",
});

export const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 0,
  compactDisplay: "short",
});
export const numberFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 2,
});

export const _percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

export const percentageFormatter = {
  format: (value?: number) => {
    if (!value) return "0%";
    return _percentageFormatter.format(value / 100);
  },
};

export const convertToPercentage = (value: string | number) =>
  Number((parseInt(`${value}`, 10) / 100).toFixed(2));

export const bigintFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: false,
  maximumFractionDigits: 7,
});

export const ethFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 4,
});

export const operatorETHFeeFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 5,
});

export const formatSSV = (num: bigint, decimals = 18) =>
  ethFormatter.format(+formatUnits(num, decimals));

export const formatETH = formatSSV;
export const formatEffectiveBalance = (num: bigint) =>
  ethFormatter.format(+formatUnits(num, 9));

export const formatBigintInput = (num: bigint, decimals = 18) =>
  bigintFormatter.format(+formatUnits(num, decimals));

export const formatOperatorETHFee = (num: bigint) =>
  operatorETHFeeFormatter.format(+formatUnits(num, 18));

const units = {
  seconds: 1000,
  minutes: 60000,
  hours: 3600000,
  days: 86400000,
  weeks: 604800000,
  months: 2629746000,
  years: 31556952000,
} as const;

export const ms = (value: number, unit: keyof typeof units): number => {
  return value * units[unit];
};

export const sortNumbers = <T extends bigint[] | number[]>(numbers: T): T => {
  return [...numbers].sort((a, b) => Number(a) - Number(b)) as T;
};
