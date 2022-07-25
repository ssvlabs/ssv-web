import Decimal from 'decimal.js';
import config from '~app/common/config';
import { compareNumbers } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';

interface ErrorObject {
    shouldDisplay: boolean,
    errorMessage: string
}

export const validatePublicKeyInput = (value: string, callback: React.Dispatch<ErrorObject>) :void => {
    const response: ErrorObject = { shouldDisplay: true, errorMessage: '' };
    const regx = /^[A-Za-z0-9]+$/;
    if (value.length === 0) {
        response.errorMessage = 'Please enter an operator key.';
    } else if (value.length !== config.FEATURE.OPERATORS.VALID_KEY_LENGTH) {
        response.errorMessage = 'Invalid operator key - see our documentation to generate your key.';
    } else if (!regx.test(value)) {
        response.errorMessage = 'Operator key should contain only alphanumeric characters.';
    } else {
        response.shouldDisplay = false;
    }
    callback(response);
};

export const validateDisplayNameInput = (value: string, callback: React.Dispatch<ErrorObject>) :void => {
    const response = { shouldDisplay: true, errorMessage: '' };
    const regx = /^[A-Za-z0-9]+$/;
    if (value.length === 0) {
        response.errorMessage = 'Please enter a display name.';
    } else if (value.length < 3 || value.length > 20) {
        response.errorMessage = 'Display name must be between 3 to 20 characters.';
    } else if (!regx.test(value)) {
        response.errorMessage = 'Display name should contain only alphanumeric characters.';
    } else {
        response.shouldDisplay = false;
    }
    callback(response);
};

export const validateAddressInput = (value: string, callback: React.Dispatch<ErrorObject>) :void => {
    const walletStore: WalletStore = WalletStore.getInstance().getStore('Wallet');
    const response = { shouldDisplay: true, errorMessage: '' };
    const regx = /^[A-Za-z0-9]+$/;
    if (value.length === 0) {
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

export const validateFeeInput = (value: string, callback: any) :void => {
    // const walletStore: WalletStore = WalletStore.getInstance().getStore('Wallet');
    const response = { shouldDisplay: false, errorMessage: '' };
    // eslint-disable-next-line radix
    if (new Decimal(Number(value) / config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).lessThan(10 ** (-14))) {
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

export const validateFeeUpdate = (previousValue: number, newValue: string, maxFeeIncrease: number, callback: any) :void => {
    const response = { shouldDisplay: false, errorMessage: '' };
    if (Number.isNaN(Number(newValue)) || Number.isFinite(newValue) || !newValue) {
        response.shouldDisplay = true;
        response.errorMessage = 'Please use numbers only.';
    } else if (compareNumbers(previousValue, newValue)) {
        response.shouldDisplay = true;
        response.errorMessage = 'Please set a different fee amount from current.';
    }
    else if (new Decimal(previousValue).mul(maxFeeIncrease).dividedBy(100).plus(previousValue).lessThan(newValue)) {
        response.shouldDisplay = true;
        response.errorMessage = `You can only increase your fee up to ${new Decimal(previousValue).mul(maxFeeIncrease).dividedBy(100).plus(previousValue - 0.01).toFixed().toString()}`;
    }
    // eslint-disable-next-line radix
    else if (new Decimal(newValue).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).lessThan(10 ** (-14))) {
        response.shouldDisplay = true;
        response.errorMessage = 'Please set a greater fee amount.';
    } else {
        response.errorMessage = '';
        response.shouldDisplay = false;
    }

    callback(response);
};