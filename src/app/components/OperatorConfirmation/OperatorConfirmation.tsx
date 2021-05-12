import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import SsvStore from '~app/common/stores/Ssv.store';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet.store';
import BackNavigation from '~app/common/components/BackNavigation';
import EmptyPlaceholder from '~app/common/components/EmptyPlaceholder';
import { longStringShorten, normalizeNumber } from '~lib/utils/strings';
import { buildDataSections, IDataSection } from '~app/common/components/DataSection';
import TransactionConfirmationContainer from '~app/common/components/TransactionConfirmationContainer';

const OperatorConfirmation = () => {
  const stores = useStores();
  const history = useHistory();
  const ssv: SsvStore = stores.ssv;
  const wallet: WalletStore = stores.wallet;

  useEffect(() => {
    const shouldRedirect = !ssv.newOperatorKeys.pubKey && !ssv.newOperatorKeys.name;
    if (shouldRedirect) history.push(config.routes.OPERATOR.HOME);
  }, [ssv.newOperatorKeys.pubKey, ssv.newOperatorKeys.name]);

  const onRegisterClick = async () => {
    await wallet.connect();
    ssv.addNewOperator().then(() => {
      history.push(config.routes.OPERATOR.SUCCESS_PAGE);
    }).catch((error) => {
      history.push(config.routes.OPERATOR.SUCCESS_PAGE);
      console.log(error);
    });
  };

  const backNavigation = <BackNavigation to={config.routes.OPERATOR.HOME} text="Register Operator" />;
  const header = <Header title={translations.OPERATOR.CONFIRMATION.TITLE} subtitle={translations.OPERATOR.CONFIRMATION.DESCRIPTION} />;
  const sections: IDataSection[] = [
    {
      title: 'Operator',
      name: 'name',
      value: ssv.newOperatorKeys.name,
    },
    {
      title: '',
      name: 'key',
      value: longStringShorten(ssv.newOperatorKeys.pubKey),
      divider: true,
    },
    {
      title: 'Est. Transaction Cost',
      name: 'Transaction fee',
      value: <>{ssv.estimationGas}ETH <strong>${normalizeNumber(ssv.dollarEstimationGas)}</strong></>,
      divider: true,
    },
    {
      title: '',
      name: <strong>Total</strong>,
      value: <strong>${normalizeNumber(ssv.dollarEstimationGas)}</strong>,
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
    >
      <EmptyPlaceholder height={150} />
    </TransactionConfirmationContainer>
  );
};

export default observer(OperatorConfirmation);
