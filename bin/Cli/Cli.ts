#!/usr/bin/env ts-node

require('jsdom-global/register');
const nodeCrypto = require('crypto');
declare global {
    interface Window { crypto: any; }
}
window.crypto = {
    getRandomValues: function(buffer:Buffer) { return nodeCrypto.randomFillSync(buffer);}
};
// imports
import Web3 from 'web3';
import ErrnoException = NodeJS.ErrnoException;
import { ISharesKeyPairs } from '~lib/crypto/Threshold';
import { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import { readFile, encryptShares, createThreshold, extractPrivateKey} from './helpers';

// variables
const argv = require('minimist');
let isArgumentsValid: boolean = true;
const argumentsCMD = argv(process.argv.slice(2));

const requireArguments: string[] = ['filePath', 'password', 'operators'];
const operators = argumentsCMD.operators && argumentsCMD.operators.split(',');
const web3 = new Web3();

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

    const keystorePassword = argumentsCMD.password.toString();

    // reading keystore file
    readFile(filePath).then((data: any) => {
        extractPrivateKey(data, keystorePassword).then((privateKey: any) => {
            createThreshold(privateKey).then((threshold: ISharesKeyPairs) => {
                encryptShares(operators, threshold.shares).then((encryptedShares: EncryptShare[]) => {
                    const operatorsPublicKey: string[] = encryptedShares.map((share: EncryptShare) => {
                        return web3.eth.abi.encodeParameter('string', share.operatorPublicKey);
                    });

                    const sharePublicKey: string[] = encryptedShares.map((share: EncryptShare) => {
                        return share.publicKey;
                    });

                    const sharePrivateKey: string[] = encryptedShares.map((share: EncryptShare) => {
                        return web3.eth.abi.encodeParameter('string', share.privateKey);
                    });
                    const payload = [
                        threshold.validatorPublicKey,
                        operatorsPublicKey,
                        sharePublicKey,
                        sharePrivateKey,
                    ];

                    console.log(payload);
                }).catch((error: any) => {
                    console.log(error);
                });
            }).catch((error: any) => {
                console.log(error);
            });
        }).catch(() => {
            console.log('Invalid keystore file password.');
        });
    }).catch((error: ErrnoException) => {
        console.log(error);
    });
}
