import config from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';

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
    } else if ((value.length !== 42 && value.startsWith('0x')) || (value.length !== 40 && !value.startsWith('0x')) || (!walletStore.addressVerification(value))) {
        response.errorMessage = 'Operator address must be a valid address format.';
    } else if (!regx.test(value)) {
        response.errorMessage = 'Operator address should contain only alphanumeric characters.';
    } else {
        response.shouldDisplay = false;
    }
    callback(response);
};

export const validateFeeInput = (value: string, callback: React.Dispatch<ErrorObject>) :void => {
    // const walletStore: WalletStore = WalletStore.getInstance().getStore('Wallet');

    const response = { shouldDisplay: false, errorMessage: '' };
    // eslint-disable-next-line radix
    if (10 ** (-14) > parseFloat(value) / 2398050) {
        response.shouldDisplay = true;
        response.errorMessage = 'Please set a greater fee amount.';
    }

    callback(response);
};
