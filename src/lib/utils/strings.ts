import type { Address } from "abitype";

export const add0x = (publicKey: string): Address =>
  (publicKey.startsWith("0x") ? publicKey : `0x${publicKey}`) as Address;

export const shortenAddress = (address: string, length = 6) =>
  `${address.slice(0, length)}...${address.slice(-(length - 2))}`;
