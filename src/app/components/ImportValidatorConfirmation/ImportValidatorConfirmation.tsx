import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import React, { useEffect, useState } from 'react';
import { roundNumber } from '~lib/utils/numbers';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import DataSection from '~app/common/components/DataSection';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
// import { formatNumberToUi } from '~lib/utils/numbers';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import ApplicationStore from '~app/common/stores/Application.store';
import ContractSsv from '~app/common/stores/contract/ContractSsv.store';
import { longStringShorten } from '~lib/utils/strings';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput';
import NameAndAddress from '~app/common/components/NameAndAddress/NameAndAddress';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp';
import { useStyles } from './ImportValidatorConfirmation.styles';

interface dataSection {
    key: any,
    value: any,
    header?: true,
    strong?: string
    selectedPosition?: number
}

const ImportValidatorConfirmation = () => {
  const stores = useStores();
  const classes = useStyles();
  const contractValidator: ContractValidator = stores.ContractValidator;
  const contractOperator: ContractOperator = stores.ContractOperator;
  const contractSsv: ContractSsv = stores.ContractSsv;
  const applicationStore: ApplicationStore = stores.Application;
  const walletStore: WalletStore = stores.Wallet;
  const [actionButtonText, setActionButtonText] = useState('Run validator');
  const [txHash, setTxHash] = useState('');
  const [checked, selectCheckBox] = useState(false);
  const { redirectUrl, history } = useUserFlow();
  const totalOperatorsYearlyFee = contractSsv.getFeeForYear(contractOperator.getSelectedOperatorsFee);
  const liquidationCollateral = (contractSsv.networkFee + contractOperator.getSelectedOperatorsFee) * contractSsv.liquidationCollateral;
  const totalAmountOfSsv = roundNumber(liquidationCollateral + contractSsv.getFeeForYear(contractSsv.networkFee) + totalOperatorsYearlyFee, 2);

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
            { key: 'SELECTED OPERATORS', header: true, value: '', strong: '' },
        ],
        [
            { key: 'TRANSACTION SUMMARY', header: true, value: '' },
            { key: <NameAndAddress name={'Operators yearly fee'} />, value: '', strong: `${totalOperatorsYearlyFee} SSV` },
            { key: <NameAndAddress name={'Network yearly fee'} />, value: '', strong: `${contractSsv.getFeeForYear(contractSsv.networkFee)} SSV` },
            { key: <NameAndAddress name={'Liquidation collateral'} />, value: '', strong: `${roundNumber(0.000006, 8)} SSV` },
            {
                key: <NameAndAddress styleWrapperClass={classes.TotalWrapper} name={'Total'} styleNameClass={classes.GreenColor} />,
                value: <NameAndAddress styleWrapperClass={classes.TotalWrapper} name={`${totalAmountOfSsv} SSV`} styleNameClass={classes.GreenColor} address={'~$490'} />,
            },
       ],
    ];
    Object.values(contractOperator.selectedOperators).forEach((operator: IOperator) => {
        if (operator.fee) {
            data[0].push({
                key: <NameAndAddress styleWrapperClass={classes.NameAndAddressWrapper} name={operator.name} address={`0x${longStringShorten(sha256(walletStore.decodeKey(operator.pubkey)), 4)}`} />,
                value: <SsvAndSubTitle ssv={roundNumber(contractSsv.getFeeForYear(operator.fee), 5)} subText={'/year'} />,
            });
        }
    });
    data[0].push({
        key: <Grid style={{ borderBottom: 'solid 1px rgb(225, 229, 236)' }} />,
        value: <Grid style={{ borderBottom: 'solid 1px rgb(225, 229, 236)' }} />,
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
            <Grid container>
              {(contractOperator.getSelectedOperatorsFee + 0) * 2 > contractSsv.ssvBalance ? (
                <Grid xs={12} className={classes.InsufficientBalanceWrapper}>
                  Insufficient SSV balance. There is not enough SSV in your wallet. <Link className={classes.ReadMore} href="https://discord.gg/5DZ7Sm9D4W" target="_blank">Need SSV?</Link>
                </Grid>
                ) : (
                  <Grid xs={12} className={classes.SufficientBalanceWrapper}>
                    Presented prices are just an estimation and may vary. <Link className={classes.ReadMore} href="https://discord.gg/5DZ7Sm9D4W" target="_blank">Read more </Link>
                  </Grid>
                )}
            </Grid>
          </Grid>
      )}
        actionButton={(
          <CTAButton
            checkboxesText={[<span>I have read and agreed to the <a target="_blank" href={'www.google.com'}>terms and condition</a></span>]}
            checkBoxesCallBack={[selectCheckBox]}
            withAllowance
            testId={'confirm-button'}
            disable={!checked}
            onClick={onRegisterValidatorClick}
            text={actionButtonText}
        />
      )}
    />
  );
};

export default observer(ImportValidatorConfirmation);
