import util from 'util';
import blsSignaturesFactory from 'bls-signatures';
import { split } from 'shamirs-secret-sharing-ts';
import { init, SecretKey, PublicKey } from '@chainsafe/bls';
import { isNode } from '~lib/utils/detectEnvironment';

export interface IShares {
  privateKey: string,
  publicKey: string
}

export interface ISharesKeyPairs {
  validatorPrivateKey: string,
  validatorPublicKey: string,
  shares: IShares[]
}

/**
 * Example of usage:
 *
 *  const threshold: Threshold = new Threshold('45df68ab75bb7ed1063b7615298e81c1ca1b0c362ef2e93937b7bba9d7c43a94');
 *  threshold.create().then((s) => {
 *    console.log(s);
 *  });
 */
class Threshold {
  protected privateKey: string;
  private utf8Decoder: any;
  private utf8Encoder: any;
  private blsSignatures: any;

  constructor(privateKey: string) {
    this.privateKey = privateKey;
    if (isNode() && typeof TextDecoder === 'undefined') {
      this.utf8Decoder = new util.TextDecoder();
      this.utf8Encoder = new util.TextEncoder();
    } else {
      this.utf8Decoder = new TextDecoder();
      this.utf8Encoder = new TextEncoder();
    }
    this.blsSignatures = blsSignaturesFactory();
  }

  serializeToHexStr(buffer: ArrayBuffer) {
    // @ts-ignore
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate keys and return promise
   */
  async create(): Promise<ISharesKeyPairs> {
    return new Promise((resolve, reject) => {
      const sharesKeyPairs: ISharesKeyPairs = {
        validatorPrivateKey: '',
        validatorPublicKey: '',
        shares: [],
      };
      init('herumi').then(() => {
        const validatorSecretKey = SecretKey.fromHex(this.privateKey);
        const shares = split(Buffer.from(this.privateKey), { shares: 4, threshold: 3 });
        this.blsSignatures.then((bls: { PrivateKey: any }) => {
          shares.forEach(share => {
            const { PrivateKey } = bls;
            const sharePrivateKey = PrivateKey.fromBytes(Uint8Array.from(share), true);
            const sharePublicK = sharePrivateKey.getPublicKey();
            sharesKeyPairs.shares.push({
              privateKey: this.serializeToHexStr(sharePrivateKey.serialize()),
              publicKey: this.serializeToHexStr(sharePublicK.serialize()),
            });
            sharePrivateKey.delete();
          });
          sharesKeyPairs.validatorPublicKey = PublicKey.fromBytes(validatorSecretKey.toPublicKey().toBytes()).toHex();
          sharesKeyPairs.validatorPrivateKey = validatorSecretKey.toHex();
          resolve(sharesKeyPairs);
        })
        .catch((error: Error) => {
          reject(error);
        });
      })
      .catch((error: Error) => {
        reject(error);
      });
    });
  }
}

export default Threshold;
