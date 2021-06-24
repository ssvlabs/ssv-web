import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import BackNavigation from '~app/common/components/BackNavigation';
import ApplicationStore from '~app/common/stores/Application.store';
import EmptyPlaceholder from '~app/common/components/EmptyPlaceholder';
import { normalizeNumber, longStringShorten } from '~lib/utils/strings';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import { buildDataSections, IDataSection } from '~app/common/components/DataSection';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp';
import TransactionConfirmationContainer from '~app/common/components/TransactionConfirmationContainer';

const ImportValidatorConfirmation = () => {
  const stores = useStores();
  const contractValidator: ContractValidator = stores.ContractValidator;
  const contractOperator: ContractOperator = stores.ContractOperator;
  const applicationStore: ApplicationStore = stores.Application;
  const walletStore: WalletStore = stores.Wallet;
  const [actionButtonText, setActionButtonText] = useState('Run validator');
  const [txHash, setTxHash] = useState('');
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const handlePendingTransaction = (transactionHash: string) => {
    setTxHash(transactionHash);
    applicationStore.showTransactionPandingPopUp(true);
  };

  const onRegisterValidatorClick = async () => {
      setActionButtonText('Waiting for confirmation...');
      return contractValidator.addNewValidator(false, handlePendingTransaction).then(() => {
        applicationStore.showTransactionPandingPopUp(false);
        history.push(config.routes.VALIDATOR.SUCCESS_PAGE);
      }).catch(() => {
        applicationStore.showTransactionPandingPopUp(false);
        setActionButtonText('Run validator');
      });
  };

  const backNavigation = <BackNavigation to={config.routes.VALIDATOR.SLASHING_WARNING} text={translations.VALIDATOR.SLASHING_WARNING.TITLE} />;
  const header = <Header title={translations.VALIDATOR.CONFIRMATION.TITLE} subtitle={translations.VALIDATOR.CONFIRMATION.DESCRIPTION} />;
  const operatorsList = contractOperator.operators.filter((operator: IOperator) => {
    return operator.selected;
  }).map((operator: IOperator, operatorIndex: number) => {
    return (
      <div key={`operator-${operatorIndex}`} style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <div>{operatorIndex + 1}. {operator.name}</div>
        <div style={{ float: 'right' }}>{longStringShorten(sha256(walletStore.decodeOperatorKey(operator.pubkey)), 4)}</div>
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
      value: <>{normalizeNumber(contractValidator.estimationGas, 4)}&nbsp;ETH &nbsp; <strong>${normalizeNumber(contractValidator.dollarEstimationGas)}</strong></>,
      divider: true,
    },
    {
      title: '',
      name: <strong>Total</strong>,
      value: <strong>${normalizeNumber(contractValidator.dollarEstimationGas)}</strong>,
    },
  ];
  const dataSections = buildDataSections(sections);

  return (
    <TransactionConfirmationContainer
      onButtonClick={onRegisterValidatorClick}
      backNavigation={backNavigation}
      header={header}
      dataSections={dataSections}
      agreement={config.ONBOARD.NETWORK_ID ? false : 'I have read and agree to the terms & conditions'}
      buttonText={actionButtonText}
    >
      <TransactionPendingPopUp txHash={txHash} />
      <EmptyPlaceholder height={50} />
    </TransactionConfirmationContainer>
  );
};

export default observer(ImportValidatorConfirmation);
