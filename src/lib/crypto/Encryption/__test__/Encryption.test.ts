import JSEncrypt from 'jsencrypt';
import Encryption, { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import Threshold, { ISharesKeyPairs } from '~lib/crypto/Threshold';

const operatorPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
                            MIICXQIBAAKBgQDMQ6q8kgHF2LEhGmnlaoKGIxJx2Bh/fb0vFTq0DPeeJgCNeYPJ
                            2ClQ316p+EMBjXAY7bC81Y2u/FGubuAzfH0JC9ENnxnlBopnSYcCzNuxRe/MwIrs
                            rLc1krHNpgFMYrTmsPjtB6cmA454SfdYO1lvcxUxCOdNQZc3PwxK8EHyoQIDAQAB
                            AoGATiTU/K8e3oG3weJJAOtuY8KnG8aAGMYRyiFlA9yyHl6Ld5Q1RtLbe4T4wi2n
                            9MAXUnIcWyGXwonk9caVHx1Q96TysDgkoALEsmq0so/bSgQGC53aUwrZEVdiwph4
                            T0F+hLl8ov5eynHuiYMHFRgJdhHoco4NNKzCqZ0MX+KBVsECQQD/e0Mn6BLhPBOK
                            o0fCkwYP20CsRPeU35gvUNEfak8FWz1fbFaf7n3d40j6lyABVQx2EjEDsZGhN6jl
                            1dq/awhLAkEAzK3LVdFZgOh+t8rDU1T77DyTjexCJpXQ2E89mHL4MzlAMLKwRL31
                            QAr3QiMJWTxHQ0aW6EvCjLGqc3Q5JY31QwJBAMM2z4jFtu9t9UyhGSsfJqmlEhTQ
                            GhIii+nTqgeENt9T6WBpqwNHu9t5WYFJSsZZ00zA97znyOxUWHVOZHiRc2MCQQCP
                            Tof1uDSQmzhN+vuzluckSm2NiwPt/CtTqHeaC7VYOBeHgTUFjHLwujzQ47Mh9aB3
                            rC7wykqXM7YCTDfO4Yv9AkBP2igHYwm9Ly88sg4EOt+FvVhqzwjzldfotDFbb6Ly
                            gECRZsqYkgW3Xzu74ZOs+L+jC3fmI4zYNSx3M4Vufy55
                            -----END RSA PRIVATE KEY-----`;

const operatorPublicKey = `-----BEGIN RSA PUBLIC KEY-----
                            MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMQ6q8kgHF2LEhGmnlaoKGIxJx
                            2Bh/fb0vFTq0DPeeJgCNeYPJ2ClQ316p+EMBjXAY7bC81Y2u/FGubuAzfH0JC9EN
                            nxnlBopnSYcCzNuxRe/MwIrsrLc1krHNpgFMYrTmsPjtB6cmA454SfdYO1lvcxUx
                            COdNQZc3PwxK8EHyoQIDAQAB
                            -----END RSA PUBLIC KEY-----`;

describe('Check Encryption shares', () => {
    it('should return encrypt shares without error', async () => {
        const validatorPrivateKey = '12f1cf0ecf8086a7e1d84b3b77da48761664e3cdc73f165c644e7f0594f98bdd';
        const threshold: Threshold = new Threshold();
        const thresholdResult: ISharesKeyPairs = await threshold.create(validatorPrivateKey);
        const encryptedShares: EncryptShare[] = new Encryption([operatorPublicKey], thresholdResult.shares).encrypt();

        let decrypted: string = '';
        encryptedShares.forEach((share: EncryptShare) => {
            const decrypt = new JSEncrypt({});
            decrypt.setPrivateKey(operatorPrivateKey);
            decrypted = decrypt.decrypt(share.privateKey) || '';
        });
        expect(decrypted).toEqual(thresholdResult.shares[0].privateKey);
        expect(encryptedShares[0].operatorPublicKey).toEqual(operatorPublicKey);
    });
});
