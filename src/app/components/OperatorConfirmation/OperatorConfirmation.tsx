import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import BackNavigation from '~app/common/components/BackNavigation';
import EmptyPlaceholder from '~app/common/components/EmptyPlaceholder';
import { longStringShorten, normalizeNumber } from '~lib/utils/strings';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';
import { buildDataSections, IDataSection } from '~app/common/components/DataSection';
import TransactionConfirmationContainer from '~app/common/components/TransactionConfirmationContainer';

const OperatorConfirmation = () => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: ContractOperator = stores.ContractOperator;
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const onRegisterClick = async () => {
    await walletStore.connect();
    operatorStore.addNewOperator().then(() => {
      history.push(config.routes.OPERATOR.SUCCESS_PAGE);
    });
  };
  const backNavigationClick = () => {
    operatorStore.setAddingNewOperator(false);
  };

  const backNavigation = <BackNavigation onClick={backNavigationClick} to={config.routes.OPERATOR.GENERATE_KEYS} text="Register Operator" />;
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
      value: longStringShorten(operatorStore.newOperatorKeys.address),
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
      buttonText="Register Operator"
      buttonTestId="submit-operator"
    >
      <EmptyPlaceholder height={150} />
    </TransactionConfirmationContainer>
  );
};

export default observer(OperatorConfirmation);
