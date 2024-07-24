import Decimal from 'decimal.js';
import config from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { IOperator, IOperatorRawData } from '~app/model/operator.model';
import { setOptimisticOperator } from '~app/redux/account.slice';
import { formatNumberToUi } from '~lib/utils/numbers.ts';
import { getStoredNetwork, testNets } from '~root/providers/networkInfo.provider.ts';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { getOperator } from '~root/services/operator.service';
import { transactionExecutor } from '~root/services/transaction.service';
import { getContractByName } from '~root/wagmi/utils';

const addNewOperator = async ({
  isContractWallet,
  operatorRawData,
  isPrivate,
  dispatch,
  onConfirmed
}: {
  isContractWallet: boolean;
  operatorRawData: IOperatorRawData;
  isPrivate: boolean;
  dispatch: Function;
  onConfirmed?: Parameters<typeof transactionExecutor>[0]['onConfirmed'];
}): Promise<boolean> => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const feePerBlock = new Decimal(operatorRawData.fee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString();

  const payload = [operatorRawData.publicKey, prepareSsvAmountToTransfer(toWei(feePerBlock)), isPrivate];
  return await transactionExecutor({
    contractMethod: contract.registerOperator,
    payload,
    isContractWallet,
    onConfirmed,
    dispatch
  });
};

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

const withdrawRewards = async ({ operator, amount, isContractWallet, dispatch }: { operator: IOperator; amount: string; isContractWallet: boolean; dispatch: Function }) => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const ssvAmount = prepareSsvAmountToTransfer(toWei(amount));
  return await transactionExecutor({
    contractMethod: contract.withdrawOperatorEarnings,
    payload: [operator.id, ssvAmount],
    getterTransactionState: async () => formatNumberToUi(await getOperatorBalance({ id: operator.id })),
    prevState: formatNumberToUi(operator.balance),
    isContractWallet,
    dispatch
  });
};

const removeOperator = async ({ operatorId, isContractWallet, dispatch }: { operatorId: number; isContractWallet: boolean; dispatch: Function }): Promise<boolean> => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }

  return await transactionExecutor({
    contractMethod: contract.removeOperator,
    payload: [operatorId],
    isContractWallet,
    onConfirmed: () => {},
    dispatch
  });
};

const approveOperatorFee = async ({ operator, isContractWallet, dispatch }: { operator: IOperator; isContractWallet: boolean; dispatch: Function }): Promise<boolean> => {
  const contract = getContractByName(EContractName.SETTER);
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

const decreaseOperatorFee = async ({
  operator,
  newFee,
  isContractWallet,
  dispatch
}: {
  operator: IOperator;
  newFee: number | string;
  isContractWallet: boolean;
  dispatch: Function;
}): Promise<boolean> => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const formattedFee = prepareSsvAmountToTransfer(toWei(new Decimal(newFee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString()));

  return await transactionExecutor({
    contractMethod: contract.reduceOperatorFee,
    payload: [operator.id, formattedFee],
    isContractWallet,
    onConfirmed: () => {
      dispatch(
        setOptimisticOperator({
          operator: {
            ...operator,
            fee: formattedFee
          },
          type: 'updated'
        })
      );
    },
    getterTransactionState: async () => {
      const { id, fee } = await getOperator(operator.id);
      return { id, fee };
    },
    prevState: { id: operator.id, fee: operator.fee },
    dispatch
  });
};

const syncOperatorFeeInfo = async (operatorId: number): Promise<any> => {
  const contract = getContractByName(EContractName.GETTER);
  try {
    const operatorCurrentFee = await contract.getOperatorFee(operatorId);
    let operatorFutureFee: number;
    let operatorApprovalBeginTime: number;
    let operatorApprovalEndTime: number;
    const response = await contract.getOperatorDeclaredFee(operatorId);
    if (response['0'] && testNets.indexOf(getStoredNetwork().networkId) !== -1) {
      operatorFutureFee = response['1'];
      operatorApprovalBeginTime = response['2'];
      operatorApprovalEndTime = response['3'];
    } else {
      operatorFutureFee = response['0'] === '0' ? 0 : response['0'];
      operatorApprovalBeginTime = response['1'] === '1' ? 0 : response['1'];
      operatorApprovalEndTime = response['2'] === '2' ? 0 : response['2'];
    }
    return {
      operatorCurrentFee: operatorCurrentFee.toString(),
      operatorFutureFee: operatorFutureFee ? operatorFutureFee.toString() : '',
      operatorApprovalBeginTime: operatorApprovalBeginTime.toString(),
      operatorApprovalEndTime: operatorApprovalEndTime.toString()
    };
  } catch (e: any) {
    console.error(`Failed to get operator fee details from the contract: ${e.message}`);
    return {
      operatorCurrentFee: '',
      operatorFutureFee: '',
      operatorApprovalBeginTime: '',
      operatorApprovalEndTime: ''
    };
  }
};

const cancelChangeFeeProcess = async ({ operator, isContractWallet, dispatch }: { operator: IOperator; isContractWallet: boolean; dispatch: Function }) => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }

  return await transactionExecutor({
    contractMethod: contract.cancelDeclaredOperatorFee,
    payload: [operator.id],
    isContractWallet,
    getterTransactionState: async () => await syncOperatorFeeInfo(operator.id),
    prevState: await syncOperatorFeeInfo(operator.id),
    dispatch
  });
};

const updateOperatorValidatorsLimit = async () => {
  const contract = getContractByName(EContractName.GETTER);
  if (!contract) {
    return;
  }
  try {
    return await contract.getValidatorsPerOperatorLimit();
  } catch (e) {
    console.error('Provided contract address is wrong', e);
    return 0;
  }
};

const initFeeIncreaseAndPeriods = async () => {
  const contract = getContractByName(EContractName.GETTER);
  if (!contract) {
    console.error('Missing contract');
    return {
      getSetOperatorFeePeriod: 0,
      declaredOperatorFeePeriod: 0,
      maxFeeIncrease: 0
    };
  }
  const { declareOperatorFeePeriod, executeOperatorFeePeriod } = await contract.getOperatorFeePeriods();
  const operatorFeeIncreaseLimit = await contract.getOperatorFeeIncreaseLimit();
  return {
    getSetOperatorFeePeriod: Number(executeOperatorFeePeriod),
    declaredOperatorFeePeriod: Number(declareOperatorFeePeriod),
    maxFeeIncrease: Number(operatorFeeIncreaseLimit) / 100
  };
};

const getMaxOperatorFee = async (): Promise<number> => {
  const contract = getContractByName(EContractName.GETTER);
  if (!contract) {
    console.error('Missing contract');
    return 0;
  }
  try {
    const res = await contract.getMaximumOperatorFee();
    return Number(fromWei(res));
  } catch (e) {
    console.error('Provided contract address is wrong', e);
    return 0;
  }
};

const updateOperatorFee = async ({ operator, newFee, isContractWallet, dispatch }: { operator: IOperator; newFee: any; isContractWallet: boolean; dispatch: Function }) => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const formattedFee = prepareSsvAmountToTransfer(toWei(new Decimal(newFee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString()));

  return await transactionExecutor({
    contractMethod: contract.declareOperatorFee,
    payload: [operator.id, formattedFee],
    isContractWallet,
    getterTransactionState: async () => await syncOperatorFeeInfo(operator.id),
    prevState: await syncOperatorFeeInfo(operator.id),
    dispatch
  });
};

const isWhitelistingContract = async (contractAddress: string) => {
  const contract = getContractByName(EContractName.GETTER);
  return contract.isWhitelistingContract(contractAddress);
};

export {
  addNewOperator,
  approveOperatorFee,
  cancelChangeFeeProcess,
  decreaseOperatorFee,
  getMaxOperatorFee,
  getOperatorBalance,
  initFeeIncreaseAndPeriods,
  isWhitelistingContract,
  removeOperator,
  syncOperatorFeeInfo,
  updateOperatorFee,
  updateOperatorValidatorsLimit,
  withdrawRewards
};
