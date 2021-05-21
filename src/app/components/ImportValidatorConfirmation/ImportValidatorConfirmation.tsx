import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Link from '@material-ui/core/Link';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import Header from '~app/common/components/Header';
import { normalizeNumber } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet.store';
import BackNavigation from '~app/common/components/BackNavigation';
import EmptyPlaceholder from '~app/common/components/EmptyPlaceholder';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import { buildDataSections, IDataSection } from '~app/common/components/DataSection';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import TransactionConfirmationContainer from '~app/common/components/TransactionConfirmationContainer';

const ImportValidatorConfirmation = () => {
  const stores = useStores();
  const contractValidator: ContractValidator = stores.ContractValidator;
  const contractOperator: ContractOperator = stores.ContractOperator;
  const walletStore: WalletStore = stores.Wallet;
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const onRegisterValidatorClick = async () => {
    await walletStore.connect().then(async () => {
      return contractValidator.addNewValidator().then(() => {
        history.push(config.routes.VALIDATOR.SUCCESS_PAGE);
      });
    });
  };

  const backNavigation = <BackNavigation to={config.routes.VALIDATOR.SLASHING_WARNING} text={translations.VALIDATOR.SLASHING_WARNING.TITLE} />;
  const header = <Header title={translations.VALIDATOR.CONFIRMATION.TITLE} subtitle={translations.VALIDATOR.CONFIRMATION.DESCRIPTION} />;
  const operatorsList = contractOperator.operators.filter((operator: IOperator) => {
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
      component: <ValidatorKeyInput validatorKey={contractValidator.validatorPublicKey} />,
      divider: true,
    },
    {
      title: 'Operators',
      component: operatorsList,
      divider: true,
    },
    {
      name: <strong>Est. Transaction Cost</strong>,
      value: <Link href="https://discord.gg/5DZ7Sm9D4W" target="_blank">Need ETH?</Link>,
    },
    {
      name: 'Network fee',
      value: 'FREE',
    },
    {
      name: 'Transaction fee',
      value: <>{contractOperator.estimationGas}ETH <strong>${normalizeNumber(contractOperator.dollarEstimationGas)}</strong></>,
      divider: true,
    },
    {
      title: '',
      name: <strong>Total</strong>,
      value: <strong>${normalizeNumber(contractOperator.dollarEstimationGas)}</strong>,
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
      buttonText="Run validator"
    >
      <EmptyPlaceholder height={50} />
    </TransactionConfirmationContainer>
  );
};

export default observer(ImportValidatorConfirmation);
