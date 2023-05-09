import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';
import BorderScreen from '~app/components/common/BorderScreen';
import ConversionInput from '~app/components/common/ConversionInput/ConversionInput';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';

type FeeChangeProps = {
    operator: any
};
const FeeChange = ({ operator } : FeeChangeProps ) => {
    console.log(operator);
    return (
        <BorderScreen
            blackHeader
            withoutNavigation
            header={'Update Fee'}
            withoutBorderBottom={true}
            body={[
                (<Typography fontSize={16}>Enter your new operator annual fee.</Typography>),
                <ConversionInput value={1}/>,
                <PrimaryButton  text={'Next'}
                                submitFunction={() => null}/>,
            ]}
        />
    );
};

export default observer(FeeChange);