import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { isMobile } from 'react-device-detect';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import { longStringShorten } from '~lib/utils/strings';
import Screen from '~app/common/components/Screen/Screen';
import DataSection from '~app/common/components/DataSection';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import ApplicationStore from '~app/common/stores/Application.store';
import ContractSsv from '~app/common/stores/contract/ContractSsv.store';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';
import { useStyles } from '~app/components/OperatorConfirmation/OperatorConfirmation.styles';

const actionButtonMargin = isMobile ? '160px' : '195px';

const OperatorConfirmation = () => {
  const stores = useStores();
  const classes = useStyles();
  const applicationStore: ApplicationStore = stores.Application;
    const contractOperator: ContractOperator = stores.ContractOperator;
    const contractSsv: ContractSsv = stores.ContractSsv;
    const walletStore: WalletStore = stores.Wallet;
  const { redirectUrl, history } = useUserFlow();
  const [actionButtonText, setActionButtonText] = useState('Register Operator');
  const [txHash, setTxHash] = useState('Register Operator');
  const [checked, setCheckBox] = useState(false);

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const onRegisterClick = async () => {
      setActionButtonText('Waiting for confirmation...');
      contractOperator.addNewOperator(false, handlePendingTransaction).then(() => {
        applicationStore.showTransactionPandingPopUp(false);
        history.push(config.routes.OPERATOR.SUCCESS_PAGE);
      }).catch(() => {
        applicationStore.showTransactionPandingPopUp(false);
        setActionButtonText('Register Operator');
      });
  };

  const handlePendingTransaction = (transactionHash: string) => {
    setActionButtonText('Sending transaction…');
    setTxHash(transactionHash);
    applicationStore.showTransactionPandingPopUp(true);
  };

  const data = [
    [
        { key: 'Operator', header: true, value: '' },
        { key: 'Name', value: contractOperator.newOperatorKeys.name },
        { key: 'Fee', value: <Grid container><Grid item xs={12}>{contractSsv.getFeeForYear(contractOperator.newOperatorKeys.fee)} SSV</Grid> <Grid item xs={12} className={classes.YearText}>/year</Grid></Grid> },
        { key: <Grid className={classes.UnderLine} />, value: <Grid className={classes.UnderLine} /> },
    ],
    [
        { key: 'Key', value: longStringShorten(sha256(walletStore.decodeKey(contractOperator.newOperatorKeys.pubKey)), 4) },
        { key: 'Owner Address', value: `0x${longStringShorten(contractOperator.newOperatorKeys.address.substring(2), 4)}` },
    ],
  ];

  return (
    <Screen
      navigationText={'Register Operator'}
      navigationLink={config.routes.OPERATOR.GENERATE_KEYS}
      title={translations.OPERATOR.CONFIRMATION.TITLE}
      subTitle={translations.OPERATOR.CONFIRMATION.DESCRIPTION}
      styleOptions={{ actionButtonMarginTop: actionButtonMargin }}
      body={(
        <Grid container spacing={0}>
          <TransactionPendingPopUp txHash={txHash} />
          <DataSection data={data} />
        </Grid>
      )}
      actionButton={(
        <CTAButton
          checkboxesText={[<span>I have read and agreed to the <a target="_blank" href={'www.google.com'}>terms and condition</a></span>]}
          checkBoxesCallBack={[setCheckBox]}
          testId={'submit-operator'}
          disable={!checked}
          onClick={onRegisterClick}
          text={actionButtonText}
        />
      )}
    />
  );
};

export default observer(OperatorConfirmation);
