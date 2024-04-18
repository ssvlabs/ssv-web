import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { IOperator } from '~app/model/operator.model';
import { transactionExecutor } from '~root/services/transaction.service';

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

const withdrawRewards = async ({ operator, amount, isContractWallet }: { operator: IOperator; amount: string; isContractWallet: boolean; }) => {
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
  });
};

export { getOperatorBalance, withdrawRewards };
