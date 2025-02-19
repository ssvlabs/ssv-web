import type { Address } from "abitype";
import { isAddressEqual, zeroAddress } from "viem";

export const getAssetLogoSrc = (address: Address) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;

export const isEthereumTokenAddress = (address: Address) =>
  isAddressEqual(address, zeroAddress) ||
  isAddressEqual(address, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
