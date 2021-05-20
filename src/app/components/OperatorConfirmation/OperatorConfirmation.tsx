import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet.store';
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
    }).catch((error: any) => {
      history.push(config.routes.OPERATOR.SUCCESS_PAGE);
      console.log(error);
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
      name: 'name',
      value: operatorStore.newOperatorKeys.name,
    },
    {
      title: '',
      name: 'key',
      value: longStringShorten(operatorStore.newOperatorKeys.pubKey),
      divider: true,
    },
    {
      title: 'Est. Transaction Cost',
      name: 'Transaction fee',
      value: <>{operatorStore.estimationGas}ETH <strong>${normalizeNumber(operatorStore.dollarEstimationGas)}</strong></>,
      divider: true,
    },
    {
      title: '',
      name: <strong>Total</strong>,
      value: <strong>${normalizeNumber(operatorStore.dollarEstimationGas)}</strong>,
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
      buttonTestId="final-register-button"
    >
      <EmptyPlaceholder height={150} />
    </TransactionConfirmationContainer>
  );
};

export default observer(OperatorConfirmation);
