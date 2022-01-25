import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import SsvStore from '~app/common/stores/SSV.store';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import OperatorStore from '~app/common/stores/Operator.store';
// import Checkbox from '~app/common/components/CheckBox/CheckBox';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import NameAndAddress from '~app/common/components/NameAndAddress';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import ApplicationStore from '~app/common/stores/Application.store';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp';
import PrimaryButton from '~app/common/components/PrimaryButton/PrimaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/OperatorConfirmation/OperatorConfirmation.styles';

const OperatorConfirmation = () => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const { redirectUrl, history } = useUserFlow();
    const operatorStore: OperatorStore = stores.Operator;
    const walletStore: WalletStore = stores.Wallet;
    // const [checked, setCheckBox] = useState(false);
    const applicationStore: ApplicationStore = stores.Application;
    const [txHash, setTxHash] = useState('Register Operator');
    const [actionButtonText, setActionButtonText] = useState('Register Operator');

    useEffect(() => {
        // redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    const onRegisterClick = async () => {
        setActionButtonText('Waiting for confirmation...');
        operatorStore.addNewOperator(false, handlePendingTransaction).then(() => {
            applicationStore.showTransactionPendingPopUp(false);
            history.push(config.routes.OPERATOR.SUCCESS_PAGE);
        }).catch(() => {
            applicationStore.showTransactionPendingPopUp(false);
            setActionButtonText('Register Operator');
        });
    };

    const handlePendingTransaction = (transactionHash: string) => {
        setActionButtonText('Sending transaction…');
        setTxHash(transactionHash);
        applicationStore.showTransactionPendingPopUp(true);
    };

    return (
      <BorderScreen
        blackHeader
        withConversion
        sectionClass={classes.Section}
        header={translations.OPERATOR.CONFIRMATION.TITLE}
        navigationLink={config.routes.OPERATOR.GENERATE_KEYS}
        body={[
          <Grid container>
            <TransactionPendingPopUp txHash={txHash} />
            <Grid item xs={12} className={classes.SubHeader}>Operator</Grid>
            <Grid container item xs={12} className={classes.RowWrapper}>
              <Grid item xs={6}>
                <NameAndAddress name={'Name'} />
              </Grid>
              <Grid item xs={6} className={classes.AlignRight}>
                <NameAndAddress name={operatorStore.newOperatorKeys.name} />
              </Grid>
            </Grid>
            {process.env.REACT_APP_NEW_STAGE && (
              <Grid container item xs={12}>
                <Grid item xs={6}>
                  <NameAndAddress name={'Fee'} />
                </Grid>
                <Grid item xs={6} className={classes.AlignRight}>
                  <SsvAndSubTitle
                    ssv={formatNumberToUi(ssvStore.getFeeForYear(operatorStore.newOperatorKeys.fee))}
                    subText={'/year'} />
                </Grid>
              </Grid>
            )}
          </Grid>,
          <Grid container>
            <Grid container item xs={12} className={classes.RowWrapper}>
              <Grid item xs={6}>
                <NameAndAddress name={'Key'} />
              </Grid>
              <Grid item xs={6} className={classes.AlignRight}>
                <NameAndAddress name={`0x${longStringShorten(sha256(walletStore.decodeKey(operatorStore.newOperatorKeys.pubKey)), 4)}`} />
              </Grid>
            </Grid>
            <Grid container item xs={12} className={classes.MarginButton}>
              <Grid item xs={6}>
                <NameAndAddress name={'Owner Address'} />
              </Grid>
              <Grid item xs={6} className={classes.AlignRight}>
                <NameAndAddress
                  name={`0x${longStringShorten(operatorStore.newOperatorKeys.address.substring(2), 4)}`} />
              </Grid>
            </Grid>
            {/* <Checkbox onClickCallBack={setCheckBox} */}
            {/*  text={(<div>I have read and agreed to the <a target={'_blank'} href={'www.google.com'}>terms and conditions</a></div>)} /> */}
            <PrimaryButton disable={false} text={actionButtonText} onClick={onRegisterClick} />
          </Grid>,
            ]}
        />
    );
};

export default observer(OperatorConfirmation);
