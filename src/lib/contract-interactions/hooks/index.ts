import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { MainnetV4GetterABI } from "@/lib/abi/mainnet/v4/getter";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import { TokenABI } from "@/lib/abi/token";
import { createContractHooks } from "@/lib/contract-interactions/core/create-contract-hooks";

/**
   Contract Hooks

  Adding a contract here will auto-generate an export file 
  based on the variable name (e.g. setter.ts, getter.ts, erc20.ts)
  that destructures all hooks from the contract object.

  This lets you import hooks directly: 
    import { useRegisterValidator } from "@/lib/contract-interactions/hooks/setter"

  Instead of importing the object and accessing properties: 
    import { setter } from "@/lib/contract-interactions/hooks"
    setter.useRegisterValidator(...)

  Requires the ABI to be a local file to generate the exports (e.g. @/lib/abi/mainnet/v4/setter.ts)
*/

export const setter = createContractHooks(
  MainnetV4SetterABI,
  () => getSSVNetworkDetails().setterContractAddress,
);

export const getter = createContractHooks(
  MainnetV4GetterABI,
  () => getSSVNetworkDetails().getterContractAddress,
);

export const erc20 = createContractHooks(TokenABI);
