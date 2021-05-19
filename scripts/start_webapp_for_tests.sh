#!/bin/bash

kill -9 $(lsof -t -i:3000)
yarn start &
npx -p node-notifier-cli notify -t 'SSV Webapp Testing' -m 'Local webapp is starting!'

fetchstatus() {
  curl \
    -o /dev/null \
    --silent \
    --head \
    --write-out '%{http_code}' \
    "http://localhost:3000/"
}

urlstatus=$(fetchstatus)          # initialize to actual value before we sleep even once
until [ "$urlstatus" = 200 ]; do  # until our result is success...
  sleep 5                         # wait a second...
  urlstatus=$(fetchstatus)        # then poll again.
done

npx -p node-notifier-cli notify -t 'SSV Webapp Testing' -m 'Local webapp is being STARTED!'
