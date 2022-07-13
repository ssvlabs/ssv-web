import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Operator from '~lib/api/Operator';
import { timeDiffCalc } from '~lib/utils/time';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/Stepper';
import { useStyles } from './index.styles';

type Props = {
    // eslint-disable-next-line no-unused-vars
    getCurrentState: (forceState?: number) => void,
};

const PendingExecution = (props: Props) => {
    const stores = useStores();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const [operator, setOperator] = useState(null);
    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        if (!operatorStore.processOperatorId) return history.push(applicationStore.strategyRedirect);
        applicationStore.setIsLoading(true);
        Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
            if (response) {
                setOperator(response);
            }
            applicationStore.setIsLoading(false);
        });
    }, []);

    // @ts-ignore
    const classes = useStyles({ step: 2 });

    const submitFeeChange = async () => {
        applicationStore.setIsLoading(true);
        // @ts-ignore
        const response = await operatorStore.approveOperatorFee(operatorStore.processOperatorId);
        if (response) {
            await props.getCurrentState(3);
        }
        applicationStore.setIsLoading(false);
    };

    // @ts-ignore
    const operatorEndApprovalTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
    const today = new Date();

    if (!operator) return null;

    // @ts-ignore
    const currentOperatorFee = formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operatorStore.operatorCurrentFee)));
    // @ts-ignore
    const operatorFutureFee = formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operatorStore.operatorFutureFee)));

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
                <SsvAndSubTitle bold leftTextAlign ssv={currentOperatorFee} />
              </Grid>
              <Grid item className={classes.Arrow} />
              <Grid item>
                <SsvAndSubTitle bold leftTextAlign ssv={operatorFutureFee} />
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
                <PrimaryButton withoutLoader={operatorStore.openCancelDialog} disable={false} text={'Execute'} submitFunction={submitFeeChange} />
              </Grid>
            </Grid>
          </Grid>,
            ]}
        />
    );
};

export default observer(PendingExecution);