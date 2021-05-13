import JSEncrypt from 'jsencrypt';
import Encryption, { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import Threshold, { ISharesKeyPairs } from '~lib/crypto/Threshold';
import { operatorPrivateKey, operatorPublicKey } from './RsaKeys';

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
