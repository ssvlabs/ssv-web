import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import WalletPopUp from '~app/components/WalletPopUp/WalletPopUp';
import UpgradeFAQ from '~app/components/UpgradeHome/components/UpgradeFAQ';
import UpgradeStore, { UpgradeSteps } from '~app/common/stores/Upgrade.store';
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

  return (
    <UpgradeGrid container>
      <UpgradeContainer>
        {upgradeStore.isTestnet ? (
          <Alert severity="warning">You are working in testnet.</Alert>
        ) : ''}
        <UpgradeState {...upgradeStateProps} />
        <UpgradeFAQ />
        <WalletPopUp />
      </UpgradeContainer>
    </UpgradeGrid>
  );
};

export default observer(UpgradeHome);
