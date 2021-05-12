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
    protected verificationMessage: string = 'verification message';

    /**
     * Generate keys and return promise
     */
    async create(privateKey: string): Promise<ISharesKeyPairs> {
        return new Promise((resolve) => {
            bls.init(bls.BLS12_381)
                .then(() => {
                    const msk = [];
                    const mpk = [];
                    const idVec = [];
                    const signatureAggregation = [];

                    // master key Polynomial
                    this.validatorPrivateKey = bls.deserializeHexStrToSecretKey(privateKey);
                    this.validatorPublicKey = this.validatorPrivateKey.getPublicKey();

                    msk.push(this.validatorPrivateKey);
                    mpk.push(this.validatorPublicKey);

                    // construct poly
                    for (let i = 1; i < this.threshold; i += 1) {
                        const sk: SecretKeyType = new bls.SecretKey();
                        sk.setByCSPRNG();
                        msk.push(sk);
                        const pk = sk.getPublicKey();
                        mpk.push(pk);
                    }

                    // evaluate shares - starting from 1 because 0 is master key
                    for (let i = 1; i <= this.sharesNumber; i += 1) {
                        const id = new bls.Id();
                        id.setInt(i);
                        idVec.push(id);
                        const shareSecretKey = new bls.SecretKey();
                        shareSecretKey.share(msk, id);

                        const sharePublicKey = new bls.PublicKey();
                        sharePublicKey.share(mpk, id);

                        const shareSignature = shareSecretKey.sign(this.verificationMessage);
                        signatureAggregation.push(shareSignature);

                        this.validatorShares.push({ privateKey: shareSecretKey.serializeToHexStr(), publicKey: sharePublicKey.serializeToHexStr() });
                    }

                    // verify shares signature
                    if (this.verifyShareSignatures(signatureAggregation, idVec)) {
                        const response: ISharesKeyPairs = {
                            validatorPrivateKey: this.validatorPrivateKey.serializeToHexStr(),
                            validatorPublicKey: this.validatorPublicKey.serializeToHexStr(),
                            shares: this.validatorShares,
                        };
                        resolve(response);
                    } else {
                        throw new Error();
                    }
                });
        });
    }

    verifyShareSignatures(signatureAggregation: string[], idVec: any) {
        const idxVec: any = this.randSelect(this.threshold, this.sharesNumber);
        const subIdVec: any = [];
        const subSigVec = [];
        for (let i = 0; i < idxVec.length; i += 1) {
            const idx: number = idxVec[i];
            subIdVec.push(idVec[idx]);
            subSigVec.push(signatureAggregation[idx]);
        }
        const aggregationSignature = new bls.Signature();
        aggregationSignature.recover(subSigVec, subIdVec);
        return this.validatorPublicKey.verify(aggregationSignature, this.verificationMessage);
    }

    randSelect(k: number, n: number) {
        const a = [];
        let prev = -1;
        for (let i = 0; i < k; i += 1) {
            const v = this.randRange(prev + 1, n - (k - i) + 1);
            a.push(v);
            prev = v;
        }
        return a;
    }
    randRange(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min));
    }
}

export default Threshold;
