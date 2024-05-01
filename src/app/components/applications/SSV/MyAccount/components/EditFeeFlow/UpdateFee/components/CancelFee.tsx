import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import ReactStepper
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import {
    IncreaseFlowProps,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import {
    StepperSteps,
    useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import PrimaryButton from '~app/atomics/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const CancelFee = ({ oldFee, newFee, currentCurrency, declareNewFeeHandler } : IncreaseFlowProps) => {
    const stores = useStores();
    const classes = useStyles({ step: StepperSteps.CANCELED });
    const operatorStore: OperatorStore = stores.Operator;

    const declareNewFee = () => {
        operatorStore.clearOperatorFeeInfo();
        declareNewFeeHandler();
    };

    return (
        <BorderScreen
            blackHeader
            withoutNavigation
            body={[
                <Grid container item>
                    <Grid container item className={classes.HeaderWrapper}>
                        <Grid item>
                            <Typography className={classes.Title}>Update Fee</Typography>
                        </Grid>
                        <Grid item className={classes.Step}>
                            Canceled
                        </Grid>
                    </Grid>
                    <ReactStepper step={StepperSteps.CANCELED} subTextAlign={'center'} />
                    <Grid item container className={classes.TextWrapper}>
                        <Grid item>
                            <Typography>Your fee has been canceled.</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container className={classes.FeesChangeWrapper}>
                        <ChangeFeeDisplayValues negativeArrow={true} currentCurrency={currentCurrency} newFee={newFee} oldFee={oldFee}/>
                    </Grid>
                    <Grid item container className={classes.ButtonsWrapper}>
                        <PrimaryButton text={'Declare New Fee'} onClick={declareNewFee} size={ButtonSize.XL}/>
                    </Grid>
                </Grid>,

            ]}
        />
    );
};

export default observer(CancelFee);
