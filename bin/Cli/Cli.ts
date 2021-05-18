#!/usr/bin/env ts-node

// recreate window object to support crypto
require("jsdom-global/register");
var nodeCrypto = require('crypto');
declare global {
  interface Window { crypto: any; }
}
window.crypto = {
  getRandomValues: function(buffer:Buffer) { return nodeCrypto.randomFillSync(buffer);}
};

// imports
import EthereumKeyStore from '~lib/crypto/EthereumKeyStore';
import Threshold, {IShares, ISharesKeyPairs} from '~lib/crypto/Threshold';
import ErrnoException = NodeJS.ErrnoException;

// variables
const fs = require('fs');
const argv = require('minimist');
let isArgumentsValid: boolean = true;
const requireArguments: string[] = ['filePath', 'password', 'operators'];
const argumentsCMD = argv(process.argv.slice(2));

// argumentsCMD validation
for (const i in requireArguments) {
  if (!(requireArguments[i] in argumentsCMD)) {
    isArgumentsValid = false;
    console.log(`need ${requireArguments[i]} of the keystore`);
  }
}
if (isArgumentsValid) {
  const operators = JSON.parse(argumentsCMD.operators);
  const { filePath } = argumentsCMD;
  const keystorePassword = argumentsCMD.password;

  // reading keystore file
  readFile(filePath).then((data: any) => {
    extractPrivateKey(data, keystorePassword).then((privateKey: any) => {
      createThreshold(privateKey).then((response: ISharesKeyPairs) => {
        console.log(operators)
        const encryptedShares: EncryptShare[] = new Encryption([operatorPublicKey], thresholdResult.shares).encrypt();
      });
    }).catch((error: any) => {
      console.log(error);
    });
  }).catch((error: ErrnoException) => {
    console.log(error);
  });
}

async function extractPrivateKey(file: string, keystorePassword: string) {
  try {
    const keyStore = new EthereumKeyStore(file);
    return await keyStore.getPrivateKey(keystorePassword).then((privateKey: string) => privateKey);
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

async function encryptShares(operatorsPublicKey: string[], shares: IShares[]) {
  try {
    const encryptedShares: EncryptShare[] = new Encryption(operatorsPublicKey, shares).encrypt();
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

async function createThreshold(privateKey: string) {
  try {
    const threshold: Threshold = new Threshold();
    return await threshold.create(privateKey);
  } catch (error: any) {
    return error;
  }
}

async function readFile(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err: ErrnoException, data: string) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}
