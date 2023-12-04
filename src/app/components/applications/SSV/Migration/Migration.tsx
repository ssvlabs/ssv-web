import React, { useState } from 'react';
import ConnectWallet from '~app/components/applications/SSV/Migration/ConnectWallet/ConnectWallet';
import UploadMigrationFile from '~app/components/applications/SSV/Migration/UploadMigrationFile/UploadMigrationFile';


const STEPS: Record<string, number> = {
    CONNECT_WALLET: 0,
    UPLOAD_MIGRATION_FILE: 1,
    REGISTER_VALIDATORS: 2,
};

const Migration = () => {
    const [currentStep, setCurrentStep] = useState(STEPS.CONNECT_WALLET);

    const nextStep = () => {
        if (currentStep === STEPS.CONNECT_WALLET) {
            setCurrentStep(STEPS.UPLOAD_MIGRATION_FILE);
        }
        else {
            setCurrentStep(STEPS.CONNECT_WALLET);
        }
    };

    const components = {
        [STEPS.CONNECT_WALLET]: ConnectWallet,
        [STEPS.UPLOAD_MIGRATION_FILE]: UploadMigrationFile,
        [STEPS.REGISTER_VALIDATORS]: ConnectWallet,
    };

    const Component = components[currentStep];

    return (
        <Component nextStep={nextStep} />
    );
};

export default Migration;
