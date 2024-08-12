import { EContractName } from '~app/model/contracts.model';

import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { ExtractAbiFunctionNames } from 'abitype';
import type { Contract } from 'ethers';
import { WaitForTransactionReceiptReturnType, decodeEventLog } from 'viem';
import { HoleskyV4SetterABI } from '~app/common/config/abi/holesky/v4/setter';
import { MainnetV4SetterABI } from '~app/common/config/abi/mainnet/v4/setter';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { getContractByName as _getContractByName } from '~root/services/contracts.service';
import { config, mainnet_private_rpc_client } from '~root/wagmi/config';
import { TokenABI } from '~app/common/config/abi/token';

type MainnetSetterFnNames = ExtractAbiFunctionNames<typeof MainnetV4SetterABI>;
type HoleskySetterFnNames = ExtractAbiFunctionNames<typeof HoleskyV4SetterABI>;

export type ContractMethod = (...args: unknown[]) => Promise<{
  hash: string;
  wait: () => Promise<WaitForTransactionReceiptReturnType & { events?: ReturnType<typeof decodeEventLog>[] }>;
}>;

type SetterContract = Record<MainnetSetterFnNames | HoleskySetterFnNames, ContractMethod>;

const getSetter = () => {
  const { networkId, tokenAddress } = getStoredNetwork();
  const isMainnet = networkId === 1;
  const abi = isMainnet ? MainnetV4SetterABI : HoleskyV4SetterABI;

  const abis = {
    [tokenAddress.toLowerCase()]: TokenABI
  };

  return abi.reduce((acc, item) => {
    if (item.type === 'function') {
      acc[item.name] = async (...args: unknown[]) => {
        const hash = await writeContract(config, {
          chainId: networkId,
          abi: abi,
          address: getStoredNetwork().setterContractAddress as `0x${string}`,
          functionName: item.name,
          args: args
        } as any);

        return {
          hash,
          wait: async () => {
            const waiter = isMainnet ? mainnet_private_rpc_client.waitForTransactionReceipt : waitForTransactionReceipt.bind(null, config);
            const recipient = await waiter({
              hash
            });
            return {
              ...recipient,
              events: recipient.logs.map((log) => {
                try {
                  return decodeEventLog({
                    abi: abis[log.address.toLowerCase()] || abi,
                    ...log
                  });
                } catch (error) {
                  return { error: (error as Error)?.message || error };
                }
              })
            };
          }
        };
      };
    }
    return acc;
  }, {} as SetterContract);
};

export const getContractByName = <T extends EContractName>(name: T): T extends EContractName.SETTER ? SetterContract : Contract => {
  switch (name) {
    case EContractName.TOKEN_SETTER:
    case EContractName.TOKEN_GETTER:
    case EContractName.DISTRIBUTION:
    case EContractName.GETTER: {
      return _getContractByName(name) as T extends EContractName.SETTER ? SetterContract : Contract;
    }
    case EContractName.SETTER:
    default:
      return getSetter() as T extends EContractName.SETTER ? SetterContract : Contract;
  }
};
