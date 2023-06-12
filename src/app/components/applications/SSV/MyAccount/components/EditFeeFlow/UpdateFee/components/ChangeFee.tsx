import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BorderScreen from '~app/components/common/BorderScreen';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import ConversionInput from '~app/components/common/ConversionInput/ConversionInput';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

const ChangeFee = ({ newFee, onChangeHandler, error, nextIsDisabled, onNextHandler, setCurrency }: UpdateFeeProps) => {
    const classes = useStyles({});
    const { checkedCondition } = useTermsAndConditions();

    return (
        <BorderScreen
            blackHeader
            withoutNavigation
            header={'Update Fee'}
            withoutBorderBottom={true}
            body={[
                <Grid container className={classes.ChangeFeeWrapper}>
                    <Typography fontSize={16}>Enter your new operator annual fee.</Typography>
                    <ConversionInput value={newFee} onChange={onChangeHandler} error={error} setCurrency={setCurrency}/>
                    <TermsAndConditionsCheckbox buttonElement={<PrimaryButton disable={nextIsDisabled || !checkedCondition} text={'Next'}
                                                                              submitFunction={onNextHandler}/>} />
                </Grid>,
            ]}
        />
    );
};

export default ChangeFee;