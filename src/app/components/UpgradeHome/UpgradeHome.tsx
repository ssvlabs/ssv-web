import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import UpgradeStore, { UpgradeSteps } from '~app/common/stores/Upgrade.store';
import UpgradeState from '~app/components/UpgradeHome/components/UpgradeState';
import ConversionState from '~app/components/UpgradeHome/components/ConversionState';

const UpgradeContainer = styled.div`
  max-width: 100%;
  padding: 15px;
  width: 600px;
  margin: auto;
  display: flex;
  align-content: center;
  align-items: center;
`;

const UpgradeHome = () => {
  const stores = useStores();
  const upgradeStore: UpgradeStore = stores.Upgrade;
  const defaultUpgradeStateProps: any = {
    title: '',
    subTitle: '',
    body: '',
    navigationText: '',
    navigationLink: '',
  };
  const [upgradeStateProps, setUpgradeStepProps] = useState(defaultUpgradeStateProps);

  const reflectUpgradeState = () => {
    switch (upgradeStore.step) {
      case UpgradeSteps.home:
        setUpgradeStepProps({
          ...upgradeStateProps,
          title: translations.UPGRADE.HOME.TITLE,
          subTitle: translations.UPGRADE.HOME.SUBTITLE,
          body: <ConversionState />,
        });
        break;
    }
  };

  useEffect(() => {
    reflectUpgradeState();
  }, [upgradeStore.step]);

  return (
    <UpgradeContainer>
      <UpgradeState {...upgradeStateProps} />
    </UpgradeContainer>
  );
};

export default observer(UpgradeHome);
