#!/bin/bash

mkdir -p ./tmp
cat ./tmp/local-node.pid | xargs kill -9
npx hardhat node > ./tmp/accounts.txt &
echo $! > ./tmp/local-node.pid
#npx -p node-notifier-cli notify -t 'SSV Webapp Testing' -m 'Starting local chain node...'

fetchstatus() {
  curl \
    -o /dev/null \
    --silent \
    --head \
    --write-out '%{http_code}' \
    "http://127.0.0.1:8545/"
}

urlstatus=$(fetchstatus)          # initialize to actual value before we sleep even once
until [ "$urlstatus" = 200 ]; do  # until our result is success...
  sleep 5                         # wait a second...
  urlstatus=$(fetchstatus)        # then poll again.
done

#npx -p node-notifier-cli notify -t 'SSV Webapp Testing' -m 'Local chain node is being STARTED!'

pushd $(pwd)
cd ./cypress/plugins
git clone https://github.com/bloxapp/ssv-network.git
cp -f ./ssv-network-tsconfig.json ./ssv-network/tsconfig.json
cd ./ssv-network
git reset --hard HEAD
git pull
npm i
rm -rf ./cache
npx hardhat run ./scripts/deploy.ts --network localhost
