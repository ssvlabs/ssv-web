import type { Address } from "abitype";

export const getAssetLogoSrc = (address: Address) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
