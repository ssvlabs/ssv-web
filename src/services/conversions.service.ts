import { ethers } from 'ethers';
import Web3, { utils } from 'web3';
import { roundNumber } from '~lib/utils/numbers';

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

const decodeParameter = (type: string, value: any) => {
  return web3.eth.abi.decodeParameter(type, value);
};

const isAddress = (address: string) => ethers.utils.isAddress(address);

export { fromWei, toWei, encodePacked, encodeParameter, decodeParameter, isAddress };
