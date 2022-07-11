import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/Stepper';
import { useStyles } from './index.styles';

const FeeUpdated = () => {
    const stores = useStores();
    const history = useHistory();
    const [operator, setOperator] = useState(null);
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        applicationStore.setIsLoading(true);
        if (!operatorStore.processOperatorId) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    const backToMyAccount = async () => {
        applicationStore.setIsLoading(true);
        setTimeout(() => {
            applicationStore.setIsLoading(false);
            history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        }, 5000);
    };

    // @ts-ignore
    const classes = useStyles({ lastStep: true });

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
                Success
              </Grid>
            </Grid>
            <ReactStepper step={3} subTextAlign={'center'} />
            <Grid item container className={classes.TextWrapper}>
              <Grid item>
                <Typography>You have successfully updated your fee. The new fee will take effect immediately.</Typography>
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
            <Grid item container className={classes.ButtonsWrapper}>
              <PrimaryButton disable={false} text={'Back to My Account'} submitFunction={backToMyAccount} />
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default observer(FeeUpdated);