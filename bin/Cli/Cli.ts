#!/usr/bin/env ts-node

require("jsdom-global/register");
const nodeCrypto = require('crypto');
declare global {
    interface Window { crypto: any; }
}
window.crypto = {
    getRandomValues: function(buffer:Buffer) { return nodeCrypto.randomFillSync(buffer);}
};
// imports
import ErrnoException = NodeJS.ErrnoException;
import { ISharesKeyPairs } from '~lib/crypto/Threshold';
import { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import { readFile, encryptShares, createThreshold, extractPrivateKey} from './helpers';

// variables
const argv = require('minimist');
let isArgumentsValid: boolean = true;
const argumentsCMD = argv(process.argv.slice(2));
const requireArguments: string[] = ['filePath', 'password', 'operators'];
const operators = argumentsCMD.operators && JSON.parse(argumentsCMD.operators);


// argumentsCMD validation
for (const i in requireArguments) {
    if (!(requireArguments[i] in argumentsCMD)) {
        isArgumentsValid = false;
        console.log(`need ${requireArguments[i]} of the keystore`);
    }
    if (requireArguments[i] === 'operators' && operators && operators.length !== 4) {
        isArgumentsValid = false;
        console.log('4 Operators are requires');
    }
}

if (isArgumentsValid) {
    const { filePath } = argumentsCMD;
    const keystorePassword = argumentsCMD.password;

    // reading keystore file
    readFile(filePath).then((data: any) => {
        extractPrivateKey(data, keystorePassword).then((privateKey: any) => {
            createThreshold(privateKey).then((threshold: ISharesKeyPairs) => {
                encryptShares(operators, threshold.shares).then((encryptedShares: EncryptShare[]) => {
                    const operatorsPublicKey: string[] = encryptedShares.map((share: EncryptShare) => {
                        return share.operatorPublicKey;
                    });

                    const sharePublicKey: string[] = encryptedShares.map((share: EncryptShare) => {
                        return share.publicKey;
                    });

                    const sharePrivateKey: string[] = encryptedShares.map((share: EncryptShare) => {
                        return share.privateKey;
                    });

                    console.log([
                        privateKey,
                        operatorsPublicKey,
                        sharePublicKey,
                        sharePrivateKey,
                    ]);
                });
            });
        }).catch((error: any) => {
            console.log(error);
        });
    }).catch((error: ErrnoException) => {
        console.log(error);
    });
}
