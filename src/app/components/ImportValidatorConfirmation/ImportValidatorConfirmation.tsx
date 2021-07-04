import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import React, { useEffect, useState } from 'react';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import DataSection from '~app/common/components/DataSection';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import ApplicationStore from '~app/common/stores/Application.store';
import { normalizeNumber, longStringShorten } from '~lib/utils/strings';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp';
import { useStyles } from './ImportValidatorConfirmation.styles';

interface dataSection {
    key: string,
    header?: true,
    value: any,
    strong?: string
}

const ImportValidatorConfirmation = () => {
  const stores = useStores();
  const classes = useStyles();
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

    const data: dataSection[][] = [
        [
            { key: 'OPERATORS', header: true, value: '', strong: '' },
        ],
        [
            { key: 'EST. TRANSACTION COST', header: true, value: <Link className={classes.etherLink} href="https://discord.gg/5DZ7Sm9D4W" target="_blank">Need ETH?</Link> },
            { key: 'Transaction fee', value: `${normalizeNumber(contractValidator.estimationGas, 4)} ETH `, strong: `$${normalizeNumber(contractValidator.dollarEstimationGas)}` },
            { key: 'Total', header: true, value: '', strong: `$${normalizeNumber(contractValidator.dollarEstimationGas)}` },
       ],
    ];

    let indexNumber: number = 0;
    contractOperator.operators.forEach((operator: IOperator) => {
          if (operator.selected) {
              indexNumber += 1;
              data[0].push({
                  key: `${indexNumber}. ${operator.name}`,
                  value: longStringShorten(sha256(walletStore.decodeOperatorKey(operator.pubkey)), 4),
              }); }
    });

  return (
    <Screen
      navigationText={translations.VALIDATOR.SLASHING_WARNING.TITLE}
      navigationLink={config.routes.VALIDATOR.SLASHING_WARNING}
      title={translations.VALIDATOR.CONFIRMATION.TITLE}
      subTitle={translations.VALIDATOR.CONFIRMATION.DESCRIPTION}
      body={(
        <Grid container spacing={3}>
          <Grid item xs className={classes.validatorTextWrapper}>
            <div className={classes.validatorText}>VALIDATOR</div>
            <ValidatorKeyInput validatorKey={contractValidator.validatorPublicKey} />
          </Grid>
          <TransactionPendingPopUp txHash={txHash} />
          <DataSection data={data} />
        </Grid>
      )}
      actionButton={(
        <CTAButton
          testId={'confirm-button'}
          disable={false}
          onClick={onRegisterValidatorClick}
          text={actionButtonText}
        />
      )}
    />
  );
};

export default observer(ImportValidatorConfirmation);
