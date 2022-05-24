import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import SecondaryButton from '~app/common/components/Button/SecondaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import PrimaryButton from '~app/common/components/Button/PrimaryButton/PrimaryButton';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ReactStepper from '~app/components/MyAccount/components/UpdateFee/components/Stepper';
import { useStyles } from './index.styles';
import { timeDiffCalc } from '~lib/utils/time';

type Props = {
    getCurrentState: () => void,
};

const PendingExecution = (props: Props) => {
    const stores = useStores();
    // @ts-ignore
    const { operator_id } = useParams();
    const operatorStore: OperatorStore = stores.Operator;
    const [operator, setOperator] = useState(null);
    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        applicationStore.setIsLoading(true);
        Operator.getInstance().getOperator(operator_id).then((response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    // @ts-ignore
    const classes = useStyles({ Step3: true });

    const submitFeeChange = async () => {
        applicationStore.setIsLoading(true);
        const response = await operatorStore.approveOperatorFee(operator_id);
        if (response) {
            await props.getCurrentState();
        }
        applicationStore.setIsLoading(false);
    };

    // @ts-ignore
    const operatorEndApprovalTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
    const today = new Date();

    if (!operator) return null;

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
                Execute
              </Grid>
            </Grid>
            <ReactStepper step={2} subTextAlign={'center'} subText={`Expires in ~ ${timeDiffCalc(today, operatorEndApprovalTime)}`} />
            <Grid item container className={classes.TextWrapper}>
              <Grid item>
                <Typography>Execute your new fee in order to finalize the fee update process.</Typography>
              </Grid>
            </Grid>
            <Grid item container className={classes.FeesChangeWrapper}>
              <Grid item>
                <SsvAndSubTitle leftTextAlign ssv={10} subText={'~$78.56'} />
              </Grid>
              <Grid item className={classes.Arrow} />
              <Grid item>
                <SsvAndSubTitle leftTextAlign ssv={11} subText={'~$98.56'} />
              </Grid>
            </Grid>
            <Grid item className={classes.Notice}>
              <Grid item className={classes.BulletsWrapper}>
                <ul>
                  <li> You can always cancel your declared fee (your managed validators will be notified accordingly).</li>
                </ul>
              </Grid>
            </Grid>
            <Grid item container className={classes.ButtonsWrapper}>
              <Grid item xs>
                <SecondaryButton withoutLoader className={classes.CancelButton} disable={false} text={'Cancel'} submitFunction={operatorStore.switchCancelDialog} />
              </Grid>
              <Grid item xs>
                <PrimaryButton disable={false} text={'Execute'} submitFunction={submitFeeChange} />
              </Grid>
            </Grid>
          </Grid>,
            ]}
        />
    );
};

export default observer(PendingExecution);