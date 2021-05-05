import Threshold from '~lib/crypto/Threshold';

describe('Check Threshold creation', () => {
    it('should return shares without error', async () => {
        const privateKey = '12f1cf0ecf8086a7e1d84b3b77da48761664e3cdc73f165c644e7f0594f98bdd';
        const publicKey = '99d8485216f6a37372a294d51f85d85bfca4b6c3201cbd389a1cdc62565f12f4ee5c491575fd85b6faa3b86eafedce57';
        await new Threshold().create(privateKey).then((response) => {
            expect(response).toHaveProperty('validatorPrivateKey', privateKey);
            expect(response).toHaveProperty('validatorPublicKey', publicKey);
            expect(response).toHaveProperty('shares');
        });
    });
});
