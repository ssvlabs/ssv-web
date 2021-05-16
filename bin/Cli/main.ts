#!/usr/bin/env ts-node
 //imports
const fs = require('fs')
const argv = require('minimist')
import EthereumKeyStore from '~lib/crypto/EthereumKeyStore';
console.log(EthereumKeyStore)
// let argumentsCMD = argv(process.argv.slice(2));
//
// // argumentsCMD validation
// if (!('filePath' in argumentsCMD)) {
//     console.log('need filePath of the keystore')
// }
// if (!('password' in argumentsCMD)) {
//     console.log('need password for the keystore')
// }
// if (!('operators' in argumentsCMD)) {
//     console.log('need a list of operators')
// }
// const operators = JSON.parse(argumentsCMD.operators);
// const filePath = argumentsCMD.filePath;
// const keystorePassword = argumentsCMD.password;
//
// // reading keystore file
// fs.readFile(argumentsCMD.filePath, 'utf8' , (err , data) => {
//     if (err) {
//         console.error(err)
//         return
//     }
//
//     // const keyStore = new EthereumKeyStore(JSON.parse(keyStoreString));
//     // console.log(keyStore)
// })
//
//
