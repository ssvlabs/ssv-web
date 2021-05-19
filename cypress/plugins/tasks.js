import fs from "fs";
import path from "path";
import { ethers, upgrades } from 'hardhat';
import { execSync, spawn } from "child_process";

const getKeyStoreData = () => {
  const validatorKeysFolder = path.join(
    process.cwd(),
    'cypress',
    'integration',
    'ssv',
    'validator_keys'
  );
  const keystoreFilePath = path.join(validatorKeysFolder, 'keystore.json');
  return fs.readFileSync(keystoreFilePath).toString();
};

const cleanup = () => {

}

async function deployContract() {
  const Contract = await ethers.getContractFactory(require('./SSVNetwork.json'));
  console.log('Deploying SSVNetwork...');
  const contract = await upgrades.deployProxy(Contract);
  await contract.deployed();
  console.log(`Contract deployed to: ${contract.address}`);
  return contract.address;
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGILL', cleanup);
process.on('SIGTERM', cleanup);

module.exports = {
  cleanup,
  deployContract,
  getKeyStoreData,
}
