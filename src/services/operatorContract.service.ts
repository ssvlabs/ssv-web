import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { IOperator, IOperatorRawData } from '~app/model/operator.model';
import { transactionExecutor } from '~root/services/transaction.service';
import { getOperator, getOperatorByPublicKey } from '~root/services/operator.service';
import { isEqualsAddresses } from '~lib/utils/strings';
import { Contract } from 'ethers';
import Decimal from 'decimal.js';
import config from '~app/common/config';

const addNewOperator = async (isContractWallet: boolean, operatorRawData: IOperatorRawData, dispatch: Function): Promise<boolean> => {
  const contract: Contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const feePerBlock = new Decimal(operatorRawData.fee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString();

  return await transactionExecutor({
    contractMethod: contract.registerOperator,
    payload: [operatorRawData.publicKey, prepareSsvAmountToTransfer(toWei(feePerBlock))],
    isContractWallet,
    getterTransactionState: async () => await getOperatorByPublicKey(operatorRawData.publicKey),
    prevState: null,
    dispatch
  });
}

const getOperatorBalance = async ({ id }: { id: number }): Promise<number> => {
  const contract = getContractByName(EContractName.GETTER);
  if (!contract) {
    return 0;
  }
  try {
    const res = await contract.getOperatorEarnings(id);
    return fromWei(res);
  } catch (e) {
    // TODO: add error handling
    console.error(e);
    return 0;
  }
};

const withdrawRewards = async ({ operator, amount, isContractWallet, dispatch }: { operator: IOperator; amount: string; isContractWallet: boolean; dispatch: Function; }) => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const ssvAmount = prepareSsvAmountToTransfer(toWei(amount));
  return await transactionExecutor({
    contractMethod: contract.withdrawOperatorEarnings,
    payload: [operator.id, ssvAmount],
    getterTransactionState: async () => await getOperatorBalance({ id: operator.id }),
    prevState: operator.balance,
    isContractWallet,
    dispatch,
  });
};

const updateOperatorAddressWhitelist = async ({ operator, address, isContractWallet, dispatch }: { operator: IOperator, address: string, isContractWallet: boolean, dispatch: Function }) => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const updatedStateGetter = async () => {
    const operatorAfter = await getOperator(operator.id);
    return operatorAfter.address_whitelist;
  };

  return await transactionExecutor({
    contractMethod: contract.setOperatorWhitelist,
    payload: [operator.id, address],
    getterTransactionState: async () => {
      const newAddress = await updatedStateGetter();
      return isEqualsAddresses(newAddress, address);
    },
    isContractWallet,
    dispatch,
  });
};

const removeOperator = async ({ operatorId, isContractWallet, dispatch }: { operatorId: number, isContractWallet: boolean, dispatch: Function }): Promise<boolean> => {
  const contract: Contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }

  return await transactionExecutor({
    contractMethod: contract.removeOperator,
    payload: [operatorId],
    isContractWallet,
    getterTransactionState: async () => !await getOperator(operatorId),
    dispatch,
  });
};

const approveOperatorFee = async ({ operator, isContractWallet, dispatch }: { operator: IOperator; isContractWallet: boolean; dispatch: Function }): Promise<boolean> => {
  const contract: Contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }

  return await transactionExecutor({
    contractMethod: contract.executeOperatorFee,
    payload: [operator.id],
    isContractWallet,
    getterTransactionState: async () => {
      const { id, fee } = await getOperator(operator.id);
      return { id, fee };
    },
    prevState: {
      id: operator.id,
      fee: operator.fee
    },
    dispatch
  });
};

const decreaseOperatorFee = async ({ operator, newFee, isContractWallet, dispatch }: { operator: IOperator; newFee: number | string; isContractWallet: boolean; dispatch: Function; }): Promise<boolean> => {
  const contract: Contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const formattedFee = prepareSsvAmountToTransfer(toWei(new Decimal(newFee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString()));

  return await transactionExecutor({
    contractMethod: contract.reduceOperatorFee,
    payload: [operator.id, formattedFee],
    isContractWallet,
    getterTransactionState: async () => {
      const { id, fee } = await getOperator(operator.id);
      return { id, fee };
    },
    prevState: { id: operator.id, fee: operator.fee },
    dispatch
  });
};

export { getOperatorBalance, withdrawRewards, updateOperatorAddressWhitelist, removeOperator, addNewOperator, approveOperatorFee, decreaseOperatorFee };
