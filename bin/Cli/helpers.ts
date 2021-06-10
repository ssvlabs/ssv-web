import EthereumKeyStore from 'eth2-keystore-js';
import Threshold, { IShares } from '~lib/crypto/Threshold';
import Encryption, { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import ErrnoException = NodeJS.ErrnoException;
import * as fs from 'fs';
// const fs = require('fs');

export async function extractPrivateKey(file: string, keystorePassword: string) {
    try {
        const keyStore = new EthereumKeyStore(file);
        return await keyStore.getPrivateKey(keystorePassword).then((privateKey: string) => privateKey);
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

export async function encryptShares(operatorsPublicKey: string[], shares: IShares[]) {
    try {
        const decodedOperators = operatorsPublicKey.map((operator: string) => {
            return atob(operator);
        });
        const encryptedShares: EncryptShare[] = await new Encryption(decodedOperators, shares).encrypt();
        return encryptedShares;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

export async function createThreshold(privateKey: string) {
    try {
        const threshold: Threshold = new Threshold();
        return await threshold.create(privateKey);
    } catch (error: any) {
        return error;
    }
}

export async function readFile(filePath: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err: ErrnoException | null, data: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}