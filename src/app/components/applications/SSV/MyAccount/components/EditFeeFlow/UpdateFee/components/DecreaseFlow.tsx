import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import ProcessStore  from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

// eslint-disable-next-line no-unused-vars
enum DECREASE_STEPS {
    // eslint-disable-next-line no-unused-vars
    DEFAULT = 'default',
    // eslint-disable-next-line no-unused-vars
    UPDATED = 'updated',
    // eslint-disable-next-line no-unused-vars
    CANCELED = 'cancelled',
}

const DecreaseFlow = ({ oldFee, newFee, currency, declareNewFeeHandler } : UpdateFeeProps) => {
    const stores = useStores();
    const navigate = useNavigate();
    const classes = useStyles({});
    const processStore: ProcessStore = stores.Process;
    const operatorStore: OperatorStore = stores.Operator;
    const [buttonText, setButtonText] = useState('Update Fee');
    const [titleLabel, setTitleLabel] = useState('Your new operator annual fee will be updated to.');
    const [decreaseStep, setDecreaseStep] = useState(DECREASE_STEPS.DEFAULT);

    const decreaseStepActions = {
        [DECREASE_STEPS.UPDATED] : () => navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD),
        [DECREASE_STEPS.CANCELED] : () => declareNewFeeHandler(),
    };

    const onUpdateFeeHandle = async () => {
        if (decreaseStep !== DECREASE_STEPS.DEFAULT) {
            decreaseStepActions[decreaseStep]();
            return;
        }
        const response = await operatorStore.decreaseOperatorFee(operatorStore.processOperatorId, newFee);
        if (!response) {
            setTitleLabel('Your fee has been canceled.');
            setButtonText('Declare New Fee');
            setDecreaseStep(DECREASE_STEPS.CANCELED);
            return;
        }
        const operator = await Operator.getInstance().getOperator(operatorStore.processOperatorId);
        const balance = await operatorStore.getOperatorBalance(operator.id);
        processStore.setProcess({
            processName: 'single_operator',
            item: { ...operator, balance },
        }, 1);
        setTitleLabel('You have successfully updated your fee. The new fee will take effect immediately.');
        setButtonText('Back To My Account');
        setDecreaseStep(DECREASE_STEPS.UPDATED);

    };
    return (
        <BorderScreen
            blackHeader
            withoutNavigation
            header={'Update Fee'}
            withoutBorderBottom={true}
            body={[
                <Grid container className={classes.ChangeFeeWrapper}>
                    <Typography fontSize={16}>{titleLabel}</Typography>
                    <ChangeFeeDisplayValues currentCurrency={currency} newFee={newFee} oldFee={oldFee}/>
                    {!decreaseStep && <Grid item className={classes.Notice}>
                       <Grid item className={classes.BulletsWrapper}>
                            Keep in mind that the process of increasing your fee is different than decreasing it, and
                            returning back to your current fee in the future would take longer.
                            Read more on fee changes
                        </Grid>
                    </Grid>}
                    <PrimaryButton text={buttonText} submitFunction={onUpdateFeeHandle}/>
                </Grid>,
            ]}
        />
    );
};

export default DecreaseFlow;