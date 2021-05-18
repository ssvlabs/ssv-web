import crypto from 'crypto';

/**
 * Returns hex value randomly generated with provided length
 * @param len
 */
export const randomValueHex = (len: number) => {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len);
};
