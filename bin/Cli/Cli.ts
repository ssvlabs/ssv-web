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
import { ISharesKeyPairs } from '~lib/crypto/Threshold';
import { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import { readFile, encryptShares, createThreshold, extractPrivateKey} from './helpers';

// variables
const web3 = new Web3();
const argv = require('minimist');
let isArgumentsValid: boolean = true;
const argumentsCMD = argv(process.argv.slice(2));

const cliParamsHandler = () => {
    const operators = argumentsCMD.operators && argumentsCMD.operators.split(',');
    // argumentsCMD validation
    ['filePath', 'password', 'operators'].forEach((argument: string) => {
        if (!(argument in argumentsCMD)) {
            isArgumentsValid = false;
            console.log(`need ${argument} of the keystore`);
        }
        if (argument === 'operators' && operators && operators.length !== 4) {
            isArgumentsValid = false;
            console.log('4 Operators are requires');
        }
    });
};

const createPayload = async (filePath: string, keystorePassword: string, operators: string[]) => {
    const data: any = await readFile(filePath);
    const privateKey = await extractPrivateKey(data, keystorePassword);
    const threshold: ISharesKeyPairs = await createThreshold(privateKey);
    const encryptedShares: EncryptShare[] = await encryptShares(operators, threshold.shares);
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
};

cliParamsHandler();
if (isArgumentsValid) {
    const filePath = argumentsCMD.filePath;
    const keystorePassword = argumentsCMD.password.toString();
    const operators = argumentsCMD.operators && argumentsCMD.operators.split(',');
    createPayload(filePath, keystorePassword, operators);
}
