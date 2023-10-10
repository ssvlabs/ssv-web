import React, { useState } from 'react';
import ConnectWallet from '~app/components/applications/SSV/Migration/ConnectWallet/ConnectWallet';


const STEPS: Record<string, number> = {
    CONNECT_WALLET: 0,
    UPLOAD_MIGRATION_FILE: 1,
    REGISTER_VALIDATORS: 2,
};

const Migration = () => {
    const [currentStep, setCurrentStep] = useState(STEPS.UPLOAD_MIGRATION_FILE);
    setCurrentStep;
    const components = {
        [STEPS.CONNECT_WALLET]: ConnectWallet,
        [STEPS.UPLOAD_MIGRATION_FILE]: ConnectWallet,
        [STEPS.REGISTER_VALIDATORS]: ConnectWallet,
    };

    const Component = components[currentStep];

    return (
        <Component />
    );
};

export default Migration;