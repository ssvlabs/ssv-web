import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { isMobile } from 'react-device-detect';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import DataSection from '~app/common/components/DataSection';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import ApplicationStore from '~app/common/stores/Application.store';
import { longStringShorten, normalizeNumber } from '~lib/utils/strings';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';

const actionButtonMargin = isMobile ? '160px' : '195px';

const OperatorConfirmation = () => {
  const stores = useStores();
  const operatorStore: ContractOperator = stores.ContractOperator;
  const applicationStore: ApplicationStore = stores.Application;
  const walletStore: WalletStore = stores.Wallet;
  const { redirectUrl, history } = useUserFlow();
  const [actionButtonText, setActionButtonText] = useState('Register Operator');
  const [txHash, setTxHash] = useState('Register Operator');

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const onRegisterClick = async () => {
      setActionButtonText('Waiting for confirmation...');
      operatorStore.addNewOperator(false, handlePendingTransaction).then(() => {
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
        { key: 'Name', value: operatorStore.newOperatorKeys.name },
        { key: 'Key', value: longStringShorten(sha256(walletStore.decodeKey(operatorStore.newOperatorKeys.pubKey)), 4) },
        { key: 'Owner Address', value: `0x${longStringShorten(operatorStore.newOperatorKeys.address.substring(2), 4)}` },
    ],
    [
      { key: 'Est. Transaction Cost', header: true, value: '' },
      { key: 'Transaction fee', value: `${normalizeNumber(operatorStore.estimationGas, 5)} ETH `, strong: `$${normalizeNumber(operatorStore.dollarEstimationGas)}` },
      { key: 'Total', value: `$${normalizeNumber(operatorStore.dollarEstimationGas)}` },
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
        <Grid container spacing={4}>
          <TransactionPendingPopUp txHash={txHash} />
          <DataSection data={data} />
        </Grid>
      )}
      actionButton={(
        <CTAButton
          testId={'submit-operator'}
          disable={false}
          onClick={onRegisterClick}
          text={actionButtonText}
        />
      )}
    />
  );
};

export default observer(OperatorConfirmation);
