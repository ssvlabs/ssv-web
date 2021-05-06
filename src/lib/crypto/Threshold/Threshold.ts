import { SecretKeyType } from 'bls-eth-wasm';

const bls = require('bls-eth-wasm/browser');

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
 *  const threshold: Threshold = new Threshold();
 *  threshold.create('45df68ab75bb7ed1063b7615298e81c1ca1b0c362ef2e93937b7bba9d7c43a94').then((s) => {
 *    console.log(s);
 *  });
 */
class Threshold {
    protected validatorPrivateKey: any;
    protected validatorPublicKey: any;
    protected validatorShares: Array<any> =[];
    protected validatorSigKey: any;
    protected threshold: number = 3;
    protected sharesNumber: number = 4;

    /**
     * Generate keys and return promise
     */
    async create(privateKey: string): Promise<ISharesKeyPairs> {
        return new Promise((resolve) => {
            bls.init(bls.BLS12_381)
                .then(() => {
                    this.validatorPrivateKey = bls.deserializeHexStrToSecretKey(privateKey);
                    this.validatorPublicKey = this.validatorPrivateKey.getPublicKey();
                    const msk = [];
                    const mpk = [];
                    const idVec = [];

                    for (let i = 0; i < this.threshold; i += 1) {
                        if (i === 0) {
                            msk.push(this.validatorPrivateKey);
                            mpk.push(this.validatorPublicKey);
                        } else {
                            const sk: SecretKeyType = new bls.SecretKey();
                            sk.setByCSPRNG();
                            msk.push(sk);

                            const pk = sk.getPublicKey();
                            mpk.push(pk);
                        }
                    }

                    for (let i = 1; i < this.sharesNumber; i += 1) {
                        const id = new bls.Id();
                        id.setInt(i);
                        idVec.push(id);
                        const shareSecretKey = new bls.SecretKey();
                        shareSecretKey.share(msk, idVec[i]);

                        const sharePublicKey = new bls.PublicKey();
                        sharePublicKey.share(mpk, idVec[i]);

                        this.validatorShares.push({ privateKey: shareSecretKey.serializeToHexStr(), publicKey: sharePublicKey.serializeToHexStr() });

                        // const sig = sk.sign(msg);
                        // sigVec.push(sig);
                        // console.log(`this is public key(${i + 1}): ${pk.serializeToHexStr()}`);
                        // console.log(`this is secret key(${i + 1}): ${sk.serializeToHexStr()}`);
                        // console.log(i + ' : verify msg : ' + pk.verify(sig, msg))
                    }

                    const response: ISharesKeyPairs = {
                        validatorPrivateKey: this.validatorPrivateKey.serializeToHexStr(),
                        validatorPublicKey: this.validatorPublicKey.serializeToHexStr(),
                        shares: this.validatorShares,
                    };
                    resolve(response);
                });
        });
    }
}

export default Threshold;
