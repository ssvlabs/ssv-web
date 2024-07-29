import { getContractByName } from '~root/wagmi/utils';
import { EContractName } from '~app/model/contracts.model';
import { fromWei } from '~root/services/conversions.service';
import { getStoredNetwork } from '~root/providers/networkInfo.provider.ts';

const MAX_WEI_AMOUNT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const checkAllowance = async ({ accountAddress }: { accountAddress: string }): Promise<number> => {
  try {
    const { setterContractAddress } = getStoredNetwork();
    const ssvContract = getContractByName(EContractName.TOKEN_GETTER);
    if (!ssvContract) {
      return 0;
    }
    const allowance = await ssvContract.allowance(accountAddress, setterContractAddress);
    return allowance || 0;
  } catch (e) {
    console.warn('checkAllowance error', e);
    return 0;
  }
};

const requestAllowance = async (callBack?: CallableFunction): Promise<boolean> => {
  try {
    const { setterContractAddress } = getStoredNetwork();
    const ssvContract = getContractByName(EContractName.TOKEN_SETTER);
    if (!ssvContract) {
      return false;
    }
    const tx = await ssvContract.approve(setterContractAddress, String(MAX_WEI_AMOUNT));
    if (tx.hash) {
      callBack && callBack({ txHash: tx.hash });
    } else {
      return false;
    }
    const receipt = await tx.wait();
    return !!receipt.blockHash;
  } catch (e: unknown) {
    console.warn('requestAllowance error', e);
    return false;
  }
};

const fetchNetworkFeeAndLiquidationCollateral = async (): Promise<{
  networkFeeWei: string;
  networkFee: number;
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
}> => {
  try {
    const contract = getContractByName(EContractName.GETTER);
    if (!contract) {
      return {
        networkFeeWei: '0',
        networkFee: 0,
        liquidationCollateralPeriod: 0,
        minimumLiquidationCollateral: 0
      };
    }
    const networkFeeWei = await contract.getNetworkFee();
    const networkFee = fromWei(networkFeeWei);
    const liquidationCollateralPeriod = Number(await contract.getLiquidationThresholdPeriod());
    const minimumLiquidationCollateral = fromWei(await contract.getMinimumLiquidationCollateral());
    return {
      networkFeeWei: networkFeeWei.toString(),
      networkFee,
      liquidationCollateralPeriod,
      minimumLiquidationCollateral
    };
  } catch (e) {
    console.warn('getNetworkFeeAndLiquidationCollateral error', e);
    return {
      networkFeeWei: '0',
      networkFee: 0,
      liquidationCollateralPeriod: 0,
      minimumLiquidationCollateral: 0
    };
  }
};

const getWalletBalance = async ({ accountAddress }: { accountAddress: string }): Promise<number> => {
  try {
    const ssvContract = getContractByName(EContractName.TOKEN_GETTER);
    if (!ssvContract) {
      return 0;
    }
    const balance = await ssvContract.balanceOf(accountAddress);
    return parseFloat(String(fromWei(balance)));
  } catch (e) {
    console.warn('getBalanceFromSsvContract error', e);
    return 0;
  }
};

export { checkAllowance, requestAllowance, fetchNetworkFeeAndLiquidationCollateral, getWalletBalance };
