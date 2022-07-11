import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
// import { timeDiffCalc } from '~lib/utils/time';
import { useStores } from '~app/hooks/useStores';
// import { formatNumberToUi } from '~lib/utils/numbers';
// import BorderScreen from '~app/components/common/BorderScreen';
// import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
// import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
// import PrimaryButton from '~app/components/common/Button/PrimaryButton';
// import SecondaryButton from '~app/components/common/Button/SecondaryButton';
// import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
// import ReactStepper from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/Stepper';
import { useStyles } from './index.styles';

type Props = {
    getCurrentState: () => void,
};

const UpdateFeeState = (props: Props) => {
    const stores = useStores();
    const history = useHistory();
    const classes = useStyles({});
    // const ssvStore: SsvStore = stores.SSV;
    // const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const [operator, setOperator] = useState(null);
    operator;

    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        applicationStore.setIsLoading(true);
        if (!operatorStore.processOperatorId) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
                setTimeout(() => {
                    props.getCurrentState();
                }, 1000);
            }
        });
    }, []);

    // @ts-ignore
    const operatorEndApprovalTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);
    const endDay = operatorEndApprovalTime.getUTCDate();
    const today = new Date();
    const endMonth = operatorEndApprovalTime.toLocaleString('default', { month: 'long' });
    endMonth;
    endDay;
    today;

    return (
      <Grid container item className={classes.HeaderWrapper}>
        <Grid item>
          <Typography className={classes.Title}>Update Fee</Typography>
        </Grid>
        <Grid item className={classes.Step}>
          Waiting Period
        </Grid>
      </Grid>
    );
};

export default observer(UpdateFeeState);