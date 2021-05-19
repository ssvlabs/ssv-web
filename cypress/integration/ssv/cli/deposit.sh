#!/bin/bash

cd cypress/integration/ssv/cli

if [ ! -f ./eth2.0-deposit-cli-master/tests/test_cli/test_auto_new_mnemonic.py ]; then
    cp -rf ./test_auto_new_mnemonic.py ./eth2.0-deposit-cli-master/tests/test_cli
fi

cd ./eth2.0-deposit-cli-master

source .venv/bin/activate
python3 -m pytest ./tests/test_cli/test_auto_new_mnemonic.py
