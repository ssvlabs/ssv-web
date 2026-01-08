import type { Address } from "abitype";

export const add0x = (publicKey: string): Address =>
  (publicKey.startsWith("0x") ? publicKey : `0x${publicKey}`) as Address;

export const remove0x = (address: string): Address =>
  address.replace(/^0x/, "") as Address;

export const formatPublicKey = (publicKey: string): string => {
  return remove0x(publicKey).toLowerCase();
};

export const shortenClusterId = (clusterId: string) => {
  const clusterIdWithout0x = remove0x(clusterId);
  return `${clusterIdWithout0x.slice(0, 4)}...${clusterIdWithout0x.slice(-4)}`;
};

export const shortenAddress = (
  address: string,
  length = 6,
  afterSlice: number = length - 2,
) => `${address.slice(0, length)}...${address.slice(-afterSlice)}`;

export const toTitleCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before capital letters following lowercase
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Insert space before capital letters following multiple capitals
    .split(/[\s_-]+/) // Split on spaces, underscores, and hyphens
    .filter((word) => word.length > 0) // Remove empty strings
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const globalValidatorRegex = /(?:0x)?[a-fA-F0-9]{96}/g;
export const extractValidatorsPublicKeys = (search: string) => {
  return Array.from(
    search.matchAll(globalValidatorRegex),
    (match) => match[0],
  ) as `0x${string}`[];
};
