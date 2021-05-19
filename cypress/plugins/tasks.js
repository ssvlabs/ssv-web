import fs from "fs";
import path from "path";
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

/**
 * Lift up new local node in order to use it
 * @returns {null}
 */
async function liftLocalNetworkNode() {
  return new Promise((resolve) => {
    if (liftLocalNetworkNode.accounts) {
      if (liftLocalNetworkNode.accounts.length === 20) {
        resolve(liftLocalNetworkNode.accounts);
        return;
      }
    }
    if (!liftLocalNetworkNode.accounts) {
      liftLocalNetworkNode.accounts = [];
    }
    if (!liftLocalNetworkNode.localNode) {
      liftLocalNetworkNode.localNode = spawn('npx', ['hardhat', 'node']);
      liftLocalNetworkNode.localNode.stdout.on('data', (data) => {
        console.log(`[hardhat node]: ${data}\n`);
        if (liftLocalNetworkNode.accounts.length < 20) {
          const output = data.toString();
          const outputParts = output.split('\n');
          console.log({outputParts})
          for (let i = 0; i < outputParts.length; i++) {
            const outputPart = outputParts[i];
            if (outputPart.indexOf('Private Key: ') !== -1) {
              let privateKey = outputPart.split('Private Key: ');
              if (privateKey.length) {
                privateKey = privateKey[1].trim();
                if (liftLocalNetworkNode.accounts.indexOf(privateKey) === -1) {
                  liftLocalNetworkNode.accounts.push(privateKey);
                }
              }
              if (liftLocalNetworkNode.accounts.length === 20) {
                resolve(liftLocalNetworkNode.accounts);
                break;
              }
            }
          }
        }
      });
      liftLocalNetworkNode.localNode.stderr.on('data', (data) => {
        console.error(`[hardhat node] Error: ${data}\n`);
      });
      liftLocalNetworkNode.localNode.on('close', (code) => {
        console.log(`[hardhat node] exited with code ${code ?? 0}\n`);
      });
    }
  });
}

const cleanup = () => {
  if (liftLocalNetworkNode.localNode) {
    liftLocalNetworkNode.localNode.stdin.pause();
    liftLocalNetworkNode.localNode.stderr.pause();
    liftLocalNetworkNode.localNode.kill();
  }
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGILL', cleanup);
process.on('SIGTERM', cleanup);

module.exports = {
  cleanup,
  getKeyStoreData,
  liftLocalNetworkNode,
}
