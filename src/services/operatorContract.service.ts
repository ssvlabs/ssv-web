import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { IOperator } from '~app/model/operator.model';
import { transactionExecutor } from '~root/services/transaction.service';
import { getOperator } from '~root/services/operator.service';
import { equalsAddresses } from '~lib/utils/strings';
import { Contract } from 'ethers';

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
      return equalsAddresses(newAddress, address);
    },
    isContractWallet,
    dispatch,
  });
};

export { getOperatorBalance, withdrawRewards, updateOperatorAddressWhitelist };
