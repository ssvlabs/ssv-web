import { ethers } from 'ethers';
import Web3, { utils } from 'web3';
import { roundNumber } from '~lib/utils/numbers';
import Decimal from 'decimal.js';
import config from '~app/common/config';

const fromWei = (amount?: number | string): number => {
  if (!amount) return 0;
  if (typeof amount === 'number' && amount === 0) return 0;
  if (typeof amount === 'string' && Number(amount) === 0) return 0;

  return parseFloat(utils.fromWei(amount.toString(), 'ether'));
};

const toWei = (amount?: number | string): string => {
  if (!amount) return '0';
  // eslint-disable-next-line no-param-reassign
  if (typeof amount === 'number') amount = roundNumber(amount, 16);
  // eslint-disable-next-line no-param-reassign
  if (typeof amount === 'string') amount = amount.slice(0, 16);
  return utils.toWei(amount.toString(), 'ether');
};

const encodePacked = utils.encodePacked;

const web3 = new Web3();

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
  return wrapFee.mul(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed(decimalPlaces ?? 2).toString();
};

export { fromWei, toWei, encodePacked, encodeParameter, decodeParameter, isAddress, prepareSsvAmountToTransfer, toDecimalNumber, getFeeForYear };
