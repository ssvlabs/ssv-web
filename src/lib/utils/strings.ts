import type { Address } from "abitype";

export const add0x = (publicKey: string): Address =>
  (publicKey.startsWith("0x") ? publicKey : `0x${publicKey}`) as Address;

export const remove0x = (address: string): Address =>
  address.replace(/^0x/, "") as Address;

export const shortenClusterId = (clusterId: string) => {
  const clusterIdWithout0x = remove0x(clusterId);
  return `${clusterIdWithout0x.slice(0, 4)}...${clusterIdWithout0x.slice(-4)}`;
};

export const shortenAddress = (
  address: string,
  length = 6,
  afterSlice: number = length - 2,
) => `${address.slice(0, length)}...${address.slice(-afterSlice)}`;
