import JSEncrypt from 'jsencrypt';
import Encryption, { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import Threshold, { ISharesKeyPairs } from '~lib/crypto/Threshold';

const operatorPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
                    MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
                    WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
                    aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
                    AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
                    xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
                    m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
                    8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
                    z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
                    rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
                    V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
                    aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
                    psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
                    uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
                    -----END RSA PRIVATE KEY-----`;

const operatorPublicKey = `-----BEGIN PUBLIC KEY-----
                        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
                    FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
                    xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
                    gwQco1KRMDSmXSMkDwIDAQAB
                    -----END PUBLIC KEY-----`;

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
