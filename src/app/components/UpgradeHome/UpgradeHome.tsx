import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import WalletPopUp from '~app/components/WalletPopUp/WalletPopUp';
import { checkUserCountryRestriction } from '~lib/utils/compliance';
import UpgradeFAQ from '~app/components/UpgradeHome/components/UpgradeFAQ';
import UpgradeStore, { UpgradeSteps } from '~app/common/stores/Upgrade.store';
import WalletStore, { Networks } from '~app/common/stores/Wallet/Wallet.store';
import UpgradeState from '~app/components/UpgradeHome/components/UpgradeState';
import ConversionState from '~app/components/UpgradeHome/components/ConversionState';
import DisclaimerState from '~app/components/UpgradeHome/components/DisclaimerState';
import UpgradeSuccessState from '~app/components/UpgradeHome/components/UpgradeSuccessState';
import ConfirmTransactionState from '~app/components/UpgradeHome/components/ConfirmTransactionState';

const UpgradeContainer = styled.div`
  max-width: 100%;
  padding: 15px;
  width: 600px;
  margin: auto;
  display: flex;
  align-content: center;
  align-items: center;
  flex-direction: column;
`;

const UpgradeGrid = styled(Grid)`
  overflow-x: hidden;
  overflow-y: scroll;
`;

const UpgradeHome = () => {
  const stores = useStores();
  const upgradeStore: UpgradeStore = stores.Upgrade;
  const walletStore: WalletStore = stores.Wallet;
  const defaultUpgradeStateProps: any = {
    title: '',
    subTitle: '',
    body: '',
    navigationText: '',
    navigationLink: '',
  };
  const [upgradeStateProps, setUpgradeStepProps] = useState(defaultUpgradeStateProps);
  const restrictedDefaultValue: any = null;
  const [isCountryRestricted, setCountryRestricted] = useState(restrictedDefaultValue);
  const [checkingCountryRestriction, setCheckingCountryRestriction] = useState(true);

  // Check if user country is restricted
  useEffect(() => {
    if (isCountryRestricted === null) {
      setCheckingCountryRestriction(true);
      checkUserCountryRestriction().then((isRestricted: boolean) => {
        setCountryRestricted(isRestricted);
      }).finally(() => {
        setCheckingCountryRestriction(false);
      });
    }
  }, [isCountryRestricted]);

  // Switch network depending of the flag in URL
  useEffect(() => {
    if (!upgradeStore.isTestnet) {
      walletStore.setNetworkId(Networks.MAINNET);
    } else {
      walletStore.setNetworkId(Networks.GOERLI);
    }
  }, [upgradeStore.isTestnet]);

  const reflectUpgradeState = () => {
    const goHome = () => {
      upgradeStore.setCdtValue(0);
      upgradeStore.setStep(UpgradeSteps.home);
      setUpgradeStepProps({
        ...defaultUpgradeStateProps,
        title: translations.UPGRADE.HOME.TITLE,
        subTitle: translations.UPGRADE.HOME.SUBTITLE,
        body: <ConversionState />,
      });
    };

    const goToConfirmation = () => {
      upgradeStore.setStep(UpgradeSteps.confirmTransaction);
      setUpgradeStepProps({
        ...defaultUpgradeStateProps,
        title: translations.UPGRADE.CONFIRM_TRANSACTION.TITLE,
        subTitle: translations.UPGRADE.CONFIRM_TRANSACTION.SUBTITLE,
        navigationOnClick: goHome,
        navigationText: 'Back',
        body: <ConfirmTransactionState />,
      });
    };

    if (!walletStore.connected) {
      goHome();
      return;
    }

    switch (upgradeStore.step) {
      case UpgradeSteps.home:
        goHome();
        break;

      case UpgradeSteps.confirmTransaction:
        goToConfirmation();
        break;

      case UpgradeSteps.disclaimer:
        setUpgradeStepProps({
          ...defaultUpgradeStateProps,
          hideTopIcons: true,
          title: 'Disclaimer',
          headerStyle: { textAlign: 'left' },
          navigationOnClick: goToConfirmation,
          navigationText: 'Back',
          body: <DisclaimerState />,
        });
        break;

      case UpgradeSteps.upgradeSuccess:
        setUpgradeStepProps({
          ...defaultUpgradeStateProps,
          title: translations.UPGRADE.UPGRADE_SUCCESS.TITLE,
          subTitle: translations.UPGRADE.UPGRADE_SUCCESS.SUBTITLE,
          body: <UpgradeSuccessState />,
        });
        break;
    }
  };

  useEffect(() => {
    reflectUpgradeState();
  }, [upgradeStore.step, walletStore.connected]);

  if (checkingCountryRestriction) {
    return (
      <UpgradeGrid container />
    );
  }

  if (isCountryRestricted) {
    return (
      <UpgradeGrid container>
        <UpgradeContainer>
          <br />
          <br />
          <br />
          <h1>We are sorry but this service is restricted in your country. For additional information, feel free to
            reach us at <a href="mailto:contact@bloxstaking.com">contact@bloxstaking.com</a></h1>
        </UpgradeContainer>
      </UpgradeGrid>
    );
  }

  return (
    <UpgradeGrid container>
      <UpgradeContainer>
        {upgradeStore.isTestnet ? (
          <Alert severity="warning">You are working in testnet.</Alert>
        ) : ''}
        <UpgradeState {...upgradeStateProps} />
        {upgradeStore.step === UpgradeSteps.home ? <UpgradeFAQ /> : ''}
        <WalletPopUp />
      </UpgradeContainer>
    </UpgradeGrid>
  );
};

export default observer(UpgradeHome);
