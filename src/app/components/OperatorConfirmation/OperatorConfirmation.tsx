import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import BackNavigation from '~app/common/components/BackNavigation';
import ApplicationStore from '~app/common/stores/Application.store';
import EmptyPlaceholder from '~app/common/components/EmptyPlaceholder';
import { longStringShorten, normalizeNumber } from '~lib/utils/strings';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';
import { buildDataSections, IDataSection } from '~app/common/components/DataSection';
import TransactionConfirmationContainer from '~app/common/components/TransactionConfirmationContainer';

const OperatorConfirmation = () => {
  const stores = useStores();
  const operatorStore: ContractOperator = stores.ContractOperator;
  const applicationStore: ApplicationStore = stores.Application;
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

  const backNavigation = <BackNavigation to={config.routes.OPERATOR.GENERATE_KEYS} text="Register Operator" />;
  const header = <Header title={translations.OPERATOR.CONFIRMATION.TITLE} subtitle={translations.OPERATOR.CONFIRMATION.DESCRIPTION} />;
  const sections: IDataSection[] = [
    {
      title: 'Operator',
      name: 'Name',
      value: operatorStore.newOperatorKeys.name,
    },
    {
      title: '',
      name: 'Address',
      value: `0x${longStringShorten(operatorStore.newOperatorKeys.address.substring(2), 4)}`,
      divider: false,
    },
    {
      title: '',
      name: 'Key',
      value: longStringShorten(operatorStore.newOperatorKeys.pubKey),
      divider: true,
    },
    {
      title: 'Est. Transaction Cost',
      name: 'Transaction fee',
      value: <>{normalizeNumber(operatorStore.estimationGas, 5)}ETH <strong>${normalizeNumber(operatorStore.dollarEstimationGas)}</strong></>,
      divider: false,
    },
    {
      title: '',
      name: <strong>Total</strong>,
      value: <strong>${normalizeNumber(operatorStore.dollarEstimationGas)}</strong>,
      divider: true,
    },
  ];
  const dataSections = buildDataSections(sections);

  return (
    <TransactionConfirmationContainer
      onButtonClick={onRegisterClick}
      backNavigation={backNavigation}
      header={header}
      dataSections={dataSections}
      agreement="I have read and agree to the terms & conditions"
      buttonText={actionButtonText}
      buttonTestId="submit-operator"
    >
      <TransactionPendingPopUp txHash={txHash} />
      <EmptyPlaceholder height={150} />
    </TransactionConfirmationContainer>
  );
};

export default observer(OperatorConfirmation);
