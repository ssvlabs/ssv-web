import { EContractName } from '~app/model/contracts.model';

import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { HoleskyV4SetterABI } from '~app/common/config/abi/holesky/v4/setter';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { getContractByName as _getContractByName } from '~root/services/contracts.service';
import { config } from '~root/wagmi/config';
import { MainnetV4SetterABI } from '../app/common/config/abi/mainnet/v4/setter';
import { WaitForTransactionReceiptReturnType } from 'viem';
import { ExtractAbiFunctionNames } from 'abitype';
import type { Contract } from 'ethers';

type MainnetSetterFnNames = ExtractAbiFunctionNames<typeof MainnetV4SetterABI>;

type ContractMethod = (...args: unknown[]) => Promise<{
  hash: string;
  wait: () => Promise<WaitForTransactionReceiptReturnType & { events?: string }>;
}>;

type SetterContract = Record<MainnetSetterFnNames, ContractMethod>;

const getSetter = () => {
  const { networkId } = getStoredNetwork();
  const abi = networkId === 1 ? MainnetV4SetterABI : HoleskyV4SetterABI;

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
            const recipient = await waitForTransactionReceipt(config, {
              hash
            });
            return {
              ...recipient,
              events: 'this is a placeholder'
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
