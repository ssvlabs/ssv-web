import type { Address } from "abitype";
import { getAddress, isAddressEqual, zeroAddress } from "viem";
import { fetchTotalSupply } from "@/lib/contract-interactions/erc-20/read/use-total-supply.ts";
import { fetchBalanceOf } from "@/lib/contract-interactions/erc-20/read/use-balance-of.ts";

export const getAssetLogoSrc = (address: Address) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;

export const isEthereumTokenAddress = (address: Address) =>
  isAddressEqual(address, zeroAddress) ||
  isAddressEqual(address, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

export const normalizeTokenAddress = (address: Address) =>
  isEthereumTokenAddress(address) ? zeroAddress : getAddress(address);

export const erc20verificationTokenAddress = async (address: Address) => {
  try {
    if (isEthereumTokenAddress(address)) {
      return true;
    }
    await fetchTotalSupply(address);
    await fetchBalanceOf(address, { account: zeroAddress || "0x" });
    return true;
  } catch {
    return false;
  }
};
