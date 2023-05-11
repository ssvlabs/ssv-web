import React from 'react';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import DeclareFee
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/DeclareFee';

const IncreaseFlow = ({ oldFee, inputValue, currency } : UpdateFeeProps) => {
    return (
        <DeclareFee newFee={inputValue} oldFee={oldFee} currentCurrency={currency} />
    );
};

export default IncreaseFlow;