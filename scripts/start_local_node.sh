#!/bin/bash


fetchstatus() {
  curl \
    -o /dev/null \
    --silent \
    --head \
    --write-out '%{http_code}' \
    "http://127.0.0.1:8545/"
}



#npx -p node-notifier-cli notify -t 'SSV Webapp Testing' -m 'Local chain node is being STARTED!'

pushd $(pwd)
accounts=$(pwd)/tmp/accounts.txt
mkdir -p ./tmp
cd ./cypress/plugins
git clone https://github.com/bloxapp/ssv-network.git
cp -f ./ssv-network-tsconfig.json ./ssv-network/tsconfig.json
cd ./ssv-network
git reset --hard HEAD
git pull
npm i
rm -rf ./cache

lsof -ti tcp:8545 | xargs kill
npx hardhat node > $accounts &
urlstatus=$(fetchstatus)          # initialize to actual value before we sleep even once
until [ "$urlstatus" = 200 ]; do  # until our result is success...
  sleep 5                         # wait a second...
  urlstatus=$(fetchstatus)        # then poll again.
done
npx hardhat run ./scripts/deploy.ts --network localhost
