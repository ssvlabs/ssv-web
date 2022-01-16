import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import OperatorStore from '~app/common/stores/Operator.store';
import ValidatorStore from '~app/common/stores/Validator.store';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import PrimaryButton from '~app/common/components/PrimaryButton';
import { useStyles } from '~app/components/SuccessScreen/SuccessScreen.styles';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';

const SuccessScreen = () => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const { redirectUrl, history } = useUserFlow();
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    let icon: string = '';
    let subTitle: any = '';
    let buttonText: string = '';
    let monitorText: string = '';

    if (operatorStore.newOperatorRegisterSuccessfully) {
        icon = 'operator';
        buttonText = 'Monitor Operator';
        subTitle = translations.SUCCESS.OPERATOR_DESCRIPTION;
        monitorText = 'View your operator\'s prefomance and manage it in the account dashboard';
    } else if (validatorStore.newValidatorReceipt) {
        icon = 'validator';
        buttonText = 'Manage Validator';
        subTitle = translations.SUCCESS.VALIDATOR_DESCRIPTION;
        monitorText = 'View and mange your balance and validators in your account dashboard';
    }

    const redirectTo = async () => {
        await operatorStore.loadOperators(true);
        await walletStore.initializeUserInfo();
        history.push(config.routes.MY_ACCOUNT.DASHBOARD);
    };

    return (
      <BorderScreen
        header={translations.SUCCESS.TITLE}
        body={[
          <Grid item container>
            <Grid item className={`${classes.Text} ${classes.SubHeader}`}>{subTitle}</Grid>
            <Grid item className={`${classes.SuccessLogo} ${icon === 'operator' ? classes.Operator : classes.Validator}`} />
            <Grid item className={`${classes.Text} ${classes.SubImageText}`}>{monitorText}</Grid>
            <PrimaryButton text={buttonText} onClick={redirectTo} />
          </Grid>,
        ]}
        />
    );
};

export default observer(SuccessScreen);
