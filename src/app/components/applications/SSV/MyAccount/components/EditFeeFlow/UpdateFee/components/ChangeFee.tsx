import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BorderScreen from '~app/components/common/BorderScreen';
import ConversionInput from '~app/components/common/ConversionInput/ConversionInput';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

const ChangeFee = ({ inputValue, onChangeHandler = () => null, error, nextIsDisabled, onNextHandler, setCurrency = () => null }: UpdateFeeProps) => {
    const classes = useStyles({});
    return (
        <BorderScreen
            blackHeader
            withoutNavigation
            header={'Update Fee'}
            withoutBorderBottom={true}
            body={[
                <Grid container className={classes.ChangeFeeWrapper}>
                    <Typography fontSize={16}>Enter your new operator annual fee.</Typography>
                    <ConversionInput value={inputValue} onChange={onChangeHandler} error={error} setCurrency={setCurrency}/>
                    <PrimaryButton disable={nextIsDisabled} text={'Next'}
                                submitFunction={onNextHandler}/>
                </Grid>,
            ]}
        />
    );
};

export default ChangeFee;