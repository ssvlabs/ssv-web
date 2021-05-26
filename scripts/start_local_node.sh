#!/bin/bash

# Folders
tmpDir=$(pwd)/tmp
ssvNetworkDir=$(pwd)/cypress/plugins/ssv-network
customTsConfig=$(pwd)/cypress/plugins/ssv-network-tsconfig.json

fetchLocalNodeStatus() {
  curl \
    -o /dev/null \
    --silent \
    --head \
    --write-out '%{http_code}' \
    "http://127.0.0.1:8545/"
}

killLocalNode() {
  echo 'Terminating local node instances..'
  urlStatus=$(fetchLocalNodeStatus)
  until [ "$urlStatus" != 200 ]; do
    sleep 5
    urlStatus=$(fetchLocalNodeStatus)
    lsof -ti tcp:8545 | xargs kill -9
  done
  return 0
}

startLocalNode() {
  echo 'Starting local node instance..'
  mkdir -p $tmpDir
  npx hardhat node > $tmpDir/accounts.txt &

  urlStatus=$(fetchLocalNodeStatus)
  until [ "$urlStatus" = 200 ]; do
    sleep 5
    urlStatus=$(fetchLocalNodeStatus)
  done
  return 0
}

updateSsvNetworkRepo() {
  echo 'Updating ssv network repository..'
  if [ -d $ssvNetworkDir ]
  then
      cd $ssvNetworkDir
      git reset --hard HEAD
      git pull
  else
      git clone https://github.com/bloxapp/ssv-network.git
  fi
  return 0
}

deployContract() {
  echo 'Deploying fresh contract..'
  cp -f $customTsConfig $ssvNetworkDir/tsconfig.json
  npm i
  rm -rf ./cache
  npx hardhat run ./scripts/deploy.ts --network localhost
  return 0
}

killLocalNode && \
startLocalNode && \
updateSsvNetworkRepo && \
deployContract
