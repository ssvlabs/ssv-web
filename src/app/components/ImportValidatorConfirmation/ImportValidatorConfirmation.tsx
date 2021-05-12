import React from 'react';
import { observer } from 'mobx-react';
import Link from '@material-ui/core/Link';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import { normalizeNumber } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet.store';
import SsvStore, { IOperator } from '~app/common/stores/Ssv.store';
import BackNavigation from '~app/common/components/BackNavigation';
import EmptyPlaceholder from '~app/common/components/EmptyPlaceholder';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput';
import { buildDataSections, IDataSection } from '~app/common/components/DataSection';
import TransactionConfirmationContainer from '~app/common/components/TransactionConfirmationContainer';

const ImportValidatorConfirmation = () => {
  const stores = useStores();
  const history = useHistory();
  const ssv: SsvStore = stores.ssv;
  const wallet: WalletStore = stores.wallet;

  const onRegisterValidatorClick = async () => {
    await wallet.connect().then(async () => {
      return ssv.addNewValidator().then(() => {
        history.push(config.routes.VALIDATOR.SUCCESS_PAGE);
      });
    });
  };

  const backNavigation = <BackNavigation to={config.routes.VALIDATOR.SLASHING_WARNING} text={translations.VALIDATOR.SLASHING_WARNING.TITLE} />;
  const header = <Header title={translations.VALIDATOR.CONFIRMATION.TITLE} subtitle={translations.VALIDATOR.CONFIRMATION.DESCRIPTION} />;
  const operatorsList = ssv.operators.filter((operator: IOperator) => {
    return operator.selected;
  }).map((operator: IOperator, operatorIndex: number) => {
    return (
      <div key={`operator-${operatorIndex}`} style={{ width: '100%' }}>
        {operatorIndex + 1}. {operator.name}
        <br />
      </div>
    );
  });
  const sections: IDataSection[] = [
    {
      title: <div style={{ paddingBottom: 7 }}>Validator<br /></div>,
      component: <ValidatorKeyInput validatorKey={ssv.validatorPublicKey} />,
      divider: true,
    },
    {
      title: 'Operators',
      component: operatorsList,
      divider: true,
    },
    {
      name: <strong>Est. Transaction Cost</strong>,
      value: <Link href="/" target="_blank">Need ETH?</Link>,
    },
    {
      name: 'Network fee',
      value: 'FREE',
    },
    {
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
      onButtonClick={onRegisterValidatorClick}
      backNavigation={backNavigation}
      header={header}
      dataSections={dataSections}
      agreement="I have read and agree to the terms & conditions"
      buttonText="Register Validator"
    >
      <EmptyPlaceholder height={50} />
    </TransactionConfirmationContainer>
  );
};

export default observer(ImportValidatorConfirmation);
