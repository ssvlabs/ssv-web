import { utils } from 'ethers';

export const longStringShorten = (value: string, firstFriction: number = 10, secondFriction: number = firstFriction, replacements: Record<string, any> | null = null) => {
  if (!value) return '';
  if (replacements) {
    for (let key in replacements) {
      value = value.replace(replacements[key], key);
    }
  }
  let str = `${value.slice(0, firstFriction)}...${value.slice(value.length - secondFriction, value.length)}`;

  return str;
};

export const truncateText = (text: string, maxCharacters: number): string => {
  if (text.length <= maxCharacters) {
    return text;
  } else {
    return `${text.slice(0, maxCharacters - 3)}...`;
  }
};

export const normalizeNumber = (number: number, friction: number = 2) => {
  return number.toFixed(friction);
};

export const checkSpecialCharacters = (value: string) => {
  const linkRegex = /^[A-Za-z0-9 _!$#’'|-]+$/;
  return linkRegex.test(value);
};

export const equalsAddresses = (a: string, b: string): boolean => {
  try {
    return utils.getAddress(a) === utils.getAddress(b);
  } catch (e: any) {
    return false;
  }
};

export const formatValidatorPublicKey = (publicKey: string) => publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`;

const checkAddressChecksum
  = (address: string) => {
  try {
    return utils.getAddress(address) === address;
  } catch (e) {
    return false;
  }
};

const toHexString = (val: any) => typeof val === 'number' ? `0x${val.toString(16)}` : val;

export { checkAddressChecksum, toHexString };
