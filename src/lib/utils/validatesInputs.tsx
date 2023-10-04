import React from 'react';
import Decimal from 'decimal.js';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { compareNumbers } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import LinkText from '~app/components/common/LinkText/LinkText';

interface ErrorObject {
    errorMessage: any,
    shouldDisplay: boolean,
}

export const validatePublicKeyInput = (value: string, callback: React.Dispatch<ErrorObject>): void => {
    const response: ErrorObject = { shouldDisplay: true, errorMessage: '' };
    const regx = /^[A-Za-z0-9]+$/;
    if (value.length === 0) {
        response.errorMessage = 'Please enter an operator key.';
    } else if (value.length !== config.FEATURE.OPERATORS.VALID_KEY_LENGTH) {
        response.errorMessage = <>Invalid operator key - see our <LinkText text={'documentation.'} link={'https://docs.ssv.network/run-a-node/operator-node/installation#generate-operator-keys'} /> to generate your key.</>;
    } else if (!regx.test(value)) {
        response.errorMessage = 'Operator key should contain only alphanumeric characters.';
    } else {
        response.shouldDisplay = false;
    }
    callback(response);
};

export const validateAddressInput = (value: string, callback: React.Dispatch<ErrorObject>, skipEmpty: boolean = false): void => {
    const walletStore: WalletStore = WalletStore.getInstance().getStore('Wallet');
    const response = { shouldDisplay: true, errorMessage: '' };
    const regx = /^[A-Za-z0-9]+$/;
    if (value.length === 0 && skipEmpty) {
        response.shouldDisplay = false;
    } else if (value.length === 0) {
        response.errorMessage = 'Please enter an operator address.';
    } else if ((value.length !== 42 && value.startsWith('0x')) || (value.length !== 40 && !value.startsWith('0x')) || (!walletStore.web3.utils.isAddress(value))) {
        response.errorMessage = 'Operator address must be a valid address format.';
    } else if (!regx.test(value)) {
        response.errorMessage = 'Operator address should contain only alphanumeric characters.';
    } else {
        response.shouldDisplay = false;
    }
    callback(response);
};

export const validateFeeInput = (value: string, callback: Function): void => {
    // const walletStore: WalletStore = WalletStore.getInstance().getStore('Wallet');
    const response = { shouldDisplay: false, errorMessage: '' };
    // eslint-disable-next-line radix
    if (value !== '0' && new Decimal(Number(value) / config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).lessThan(config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK)) {
        response.shouldDisplay = true;
        response.errorMessage = 'Please set a greater fee amount.';
    } else if (Number.isNaN(Number(value)) || Number.isFinite(value)) {
        response.shouldDisplay = true;
        response.errorMessage = 'Please use numbers only.';
    } else {
        response.shouldDisplay = false;
    }

    callback(response);
};

export const validateOperatorPublicKey = async (publicKey: string): Promise<boolean> => {
    const res = await Operator.getInstance().getOperatorByPublicKey(publicKey);
    return res.data;
};

export const validateFeeUpdate = (previousValue: number, newValue: string, maxFeeIncrease: number, callback: any): void => {
    const response = { shouldDisplay: false, errorMessage: '' };
    const feeMaximumIncrease = new Decimal(previousValue).mul(maxFeeIncrease).dividedBy(100).plus(previousValue - 0.01);
    if (Number.isNaN(Number(newValue)) || Number.isFinite(newValue) || !newValue) {
        response.shouldDisplay = true;
        response.errorMessage = 'Please use numbers only.';
    } else if (Number(previousValue) === Number(newValue)) {
        response.shouldDisplay = true;
        response.errorMessage = 'State for fee hasn\'t changed';
    } else if (compareNumbers(previousValue, newValue)) {
        response.shouldDisplay = true;
        response.errorMessage = 'Please set a different fee amount from current.';
    } else if (feeMaximumIncrease.lessThan(newValue)) {
        response.shouldDisplay = true;
        response.errorMessage = `You can only increase your fee up to ${feeMaximumIncrease.toFixed().toString()}`;
    }
    // eslint-disable-next-line radix
    else if (new Decimal(newValue).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).lessThan(config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK)) {
        const minimumFeePerYear = config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR * config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK;
        response.shouldDisplay = true;
        response.errorMessage = `Fee must be higher than ${minimumFeePerYear} SSV`;
    } else {
        response.errorMessage = '';
        response.shouldDisplay = false;
    }

    callback(response);
};
