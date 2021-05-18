import asyncio
import json
import os

import pytest
from click.testing import CliRunner

from eth_utils import decode_hex
from eth2deposit.key_handling.key_derivation.mnemonic import (
    get_languages,
    get_mnemonic,
)
from eth2deposit.utils.constants import WORD_LISTS_PATH
from eth2deposit.cli import new_mnemonic
from eth2deposit.deposit import cli
from eth2deposit.utils.constants import DEFAULT_VALIDATOR_KEYS_FOLDER_NAME, ETH1_ADDRESS_WITHDRAWAL_PREFIX
from .helpers import clean_key_folder, get_permissions, get_uuid

def test_new_mnemonic(monkeypatch) -> None:
    mnemonic_language='english'
    mnemonic = get_mnemonic(language=mnemonic_language, words_path=WORD_LISTS_PATH)

    # monkeypatch get_mnemonic
    def mock_get_mnemonic(language, words_path, entropy=None) -> str:
        return mnemonic

    monkeypatch.setattr(new_mnemonic, "get_mnemonic", mock_get_mnemonic)

    # Prepare folder
    my_folder_path = os.path.join(os.getcwd(), '..')
    try:
      clean_key_folder(my_folder_path)
    except Exception as e:
      pass
    if not os.path.exists(my_folder_path):
        os.mkdir(my_folder_path)

    runner = CliRunner()
    inputs = ['english', '1', 'pyrmont', 'testtest', 'testtest', mnemonic]
    data = '\n'.join(inputs)
    result = runner.invoke(cli, ['new-mnemonic', '--folder', my_folder_path], input=data)
    assert result.exit_code == 0

    # Check files
    validator_keys_folder_path = os.path.join(my_folder_path, DEFAULT_VALIDATOR_KEYS_FOLDER_NAME)
    _, _, key_files = next(os.walk(validator_keys_folder_path))

    all_uuid = [
        get_uuid(validator_keys_folder_path + '/' + key_file)
        for key_file in key_files
        if key_file.startswith('keystore')
    ]
    assert len(set(all_uuid)) == 1

    # Verify file permissions
    if os.name == 'posix':
        for file_name in key_files:
            assert get_permissions(validator_keys_folder_path, file_name) == '0o440'
