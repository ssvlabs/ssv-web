interface ErrorObject {
    shouldDisplay: boolean,
    errorMessage: string
}

export const validatePublicKeyInput = (value: string, callback: React.Dispatch<ErrorObject>) :void => {
    const response: ErrorObject = { shouldDisplay: true, errorMessage: '' };
    const regx = /^[A-Za-z0-9]+$/;
    if (value.length === 0) {
        response.errorMessage = 'Please enter an operator key.';
    } else if (value.length !== 42) {
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
    } else if (value.length < 4 || value.length > 21) {
        response.errorMessage = 'Display name must be between 3 to 20 characters.';
    } else if (!regx.test(value)) {
        response.errorMessage = 'Display name should contain only alphanumeric characters.';
    } else {
        response.shouldDisplay = false;
    }
    callback(response);
};
