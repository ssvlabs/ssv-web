import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import { formatNumberToUi, multiplyNumber } from '~lib/utils/numbers';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/Stepper';
import { useStyles } from './index.styles';

const FeeUpdated = () => {
    const stores = useStores();
    const history = useHistory();

    // @ts-ignore
    const { operator_id } = useParams();
    const [operator, setOperator] = useState(null);
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
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

    const backToMyAccount = async () => {
        Operator.getInstance().clearOperatorsCache();
        applicationStore.setIsLoading(true);
        setTimeout(() => {
            applicationStore.setIsLoading(false);
            history.push(`/dashboard/operator/${operator_id}`);
        }, 5000);
    };

    // @ts-ignore
    const classes = useStyles({ lastStep: true });

    if (!operator) return null;

    // @ts-ignore
    const currentOperatorFee = formatNumberToUi(multiplyNumber(walletStore.fromWei(operatorStore.operatorCurrentFee), config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR));
    // @ts-ignore
    const operatorFutureFee = formatNumberToUi(multiplyNumber(walletStore.fromWei(operatorStore.operatorFutureFee), config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR));

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