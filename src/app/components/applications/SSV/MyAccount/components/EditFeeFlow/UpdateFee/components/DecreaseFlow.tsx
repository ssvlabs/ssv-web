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

const DecreaseFlow = ({ oldFee, newFee, currency } : UpdateFeeProps) => {
    const stores = useStores();
    const navigate = useNavigate();
    const classes = useStyles({});
    const processStore: ProcessStore = stores.Process;
    const operatorStore: OperatorStore = stores.Operator;
    const [buttonText, setButtonText] = useState('Update Fee');
    const [updated, setUpdated] = useState(false);

    const onUpdateFeeHandle = async () => {
        if (updated) {
            navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
        } else {
            await operatorStore.decreaseOperatorFee(operatorStore.processOperatorId, newFee);
            const operator = await Operator.getInstance().getOperator(operatorStore.processOperatorId);
            const balance = await operatorStore.getOperatorBalance(operator.id);
            processStore.setProcess({
                processName: 'single_operator',
                item: { ...operator, balance },
            }, 1);
            setButtonText('Back To My Account');
            setUpdated(true);
        }
    };
    return (
        <BorderScreen
            blackHeader
            withoutNavigation
            header={'Update Fee'}
            withoutBorderBottom={true}
            body={[
                <Grid container className={classes.ChangeFeeWrapper}>
                    <Typography fontSize={16}>{updated ? 'You have successfully updated your fee. The new fee will take effect immediately.' : 'Your new operator annual fee will be updated to.'}</Typography>
                    <ChangeFeeDisplayValues currentCurrency={currency} newFee={newFee} oldFee={oldFee}/>
                    {!updated && <Grid item className={classes.Notice}>
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