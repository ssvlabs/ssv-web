import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
// import Checkbox from '~app/common/components/CheckBox/CheckBox';
import NameAndAddress from '~app/components/common/NameAndAddress';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/OperatorConfirmation/OperatorConfirmation.styles';

const OperatorConfirmation = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const operatorStore: OperatorStore = stores.Operator;
    const walletStore: WalletStore = stores.Wallet;
    // const [checked, setCheckBox] = useState(false);
    const applicationStore: ApplicationStore = stores.Application;
    const [actionButtonText, setActionButtonText] = useState('Register Operator');

    const onRegisterClick = async () => {
        try {
            applicationStore.setIsLoading(true);
            setActionButtonText('Waiting for confirmation...');
            const operatorAdded = await operatorStore.addNewOperator(false);
            if (operatorAdded) history.push(config.routes.OPERATOR.SUCCESS_PAGE);
            setActionButtonText('Register Operator');
        } catch {
            setActionButtonText('Register Operator');
        }
        applicationStore.setIsLoading(false);
        applicationStore.showTransactionPendingPopUp(false);
    };

    return (
      <BorderScreen
        blackHeader
        sectionClass={classes.Section}
        header={translations.OPERATOR.CONFIRMATION.TITLE}
        body={[
          <Grid container>
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
                    ssv={formatNumberToUi(operatorStore.newOperatorKeys.fee)}
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
            <PrimaryButton disable={false} text={actionButtonText} submitFunction={onRegisterClick} />
          </Grid>,
        ]}
      />
    );
};

export default observer(OperatorConfirmation);
