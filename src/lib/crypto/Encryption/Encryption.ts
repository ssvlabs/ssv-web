import JSEncrypt from 'jsencrypt';
import { IShares } from '~lib/crypto/Threshold';

export interface EncryptShare {
    operatorPublicKey: string,
    privateKey: string,
    publicKey: string
}

export default class Encryption {
    private readonly operators: string[];
    private readonly shares: IShares[];

    constructor(operators: string[], shares: IShares[]) {
        this.operators = operators;
        this.shares = shares;
    }

    encrypt() {
        const encryptedShares: EncryptShare[] = [];
        Object.keys(this.operators).forEach((operator: any) => {
            const encrypt = new JSEncrypt({});
            encrypt.setPublicKey(this.operators[operator]);
            const encrypted = encrypt.encrypt(this.shares[operator].privateKey);
            const encryptedShare: EncryptShare = {
                operatorPublicKey: this.operators[operator],
                privateKey: String(encrypted),
                publicKey: this.shares[operator].publicKey,
            };
            encryptedShares.push(encryptedShare);
            return encryptedShare;
        });
        return encryptedShares;
    }
}