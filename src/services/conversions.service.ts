import { ethers } from 'ethers';
import Web3 from 'web3';
import { utils as web3Utils } from 'web3';
import { utils } from 'ethers';
import { roundNumber } from '~lib/utils/numbers';
import Decimal from 'decimal.js';
import config from '~app/common/config';

const fromWei = (amount?: number | string): number => {
  if (!amount) return 0;
  if (typeof amount === 'number' && amount === 0) return 0;
  if (typeof amount === 'string' && Number(amount) === 0) return 0;
  return parseFloat(utils.formatEther(amount.toString()));
};

const toWei = (amount?: number | string): string => {
  if (!amount) return '0';
  let convertedAmount = amount;
  if (typeof amount === 'number') {
    convertedAmount = roundNumber(amount, 16);
  }
  if (typeof amount === 'string') {
    convertedAmount = amount.slice(0, 16);
  }
  // toFixed will convert 1e-18 to '0.000000000000000001', utils.parseUnits doesn't like numbers with 'e' in it
  return utils.parseUnits((+convertedAmount).toFixed(16), 'ether').toString();
};

const web3 = new Web3();

const encodePacked = web3Utils.encodePacked;

const encodeParameter = (type: string, value: any) => {
  return web3.eth.abi.encodeParameter(type, value);
};

const decodeParameter = (type: string, value: any): string => {
  return web3.eth.abi.decodeParameter(type, value) as string;
};

const isAddress = (address: string) => ethers.utils.isAddress(address);

const prepareSsvAmountToTransfer = (amountInWei: string): string => {
  return new Decimal(amountInWei).dividedBy(10000000).floor().mul(10000000).toFixed().toString();
};

const toDecimalNumber = (fee: number, decimalPlaces?: number): string => {
  return new Decimal(fee).toFixed(decimalPlaces ?? 18).toString();
};

const getFeeForYear = (fee: number, decimalPlaces?: number): string => {
  const wrapFee = new Decimal(fee);
  const feePerYear = Number(wrapFee.mul(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR));
  const places = feePerYear < 0.0099 ? 10 : 2;
  return wrapFee
    .mul(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR)
    .toFixed(decimalPlaces ?? places)
    .toString();
};

export { fromWei, toWei, encodeParameter, decodeParameter, isAddress, prepareSsvAmountToTransfer, toDecimalNumber, getFeeForYear, encodePacked };
