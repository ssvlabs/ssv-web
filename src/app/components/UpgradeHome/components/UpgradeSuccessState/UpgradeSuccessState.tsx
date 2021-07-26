import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import UpgradeStore, { UpgradeSteps } from '~app/common/stores/Upgrade.store';
import { useStyles } from '~app/components/UpgradeHome/components/UpgradeSuccessState/UpgradeSuccessState.styles';
import { ActionButton } from '~app/components/UpgradeHome/components/ConversionState/ConversionState';

const AddSSVToMetamaskButton = styled(Button)`
  border: 1px solid #5B6C84;
  border-radius: 6px;
  color: #5B6C84;
  text-transform: none;
  padding-left: 15px;
  padding-right: 15px;
  margin: auto;
  
  &:hover, &:active, &:focus {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  & img {
    width: 20px;
    height: 20px;
    margin-left: 10px;
  }
`;

const ViewOnExplorerLink = styled.a`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  text-align: center;
  text-decoration-line: underline;
  color: #2B47E3;
  margin: 20px auto auto;
`;

const BackLink = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  color: #5B6C84;
  margin: 30px auto auto;
  cursor: pointer;
`;

const LearnMoreLink = styled(Link)`
  margin-top: 100px;
  &:hover {
    text-decoration: none;
  }
`;

const UpgradeSuccessState = () => {
  const classes = useStyles();
  const stores = useStores();
  const upgradeStore: UpgradeStore = stores.Upgrade;

  const onBackButtonClick = () => {
    upgradeStore.setStep(UpgradeSteps.home);
  };

  const onAddSsvToMetamaskClick = () => {
    upgradeStore.registerSSVTokenInMetamask();
  };

  return (
    <Grid container spacing={0} justify="center" className={classes.root}>
      <Grid item xs={12} md={12} lg={12} style={{ margin: 'auto', display: 'flex', flexDirection: 'column' }}>
        <AddSSVToMetamaskButton onClick={onAddSsvToMetamaskClick}>
          Add SSV to Metamask
          <img src="/images/metamask.svg" alt="MetaMask" />
        </AddSSVToMetamaskButton>

        <ViewOnExplorerLink href="/">View on explorer</ViewOnExplorerLink>

        <LearnMoreLink
          href="https://ssv.network"
          target="_blank"
        >
          <ActionButton style={{ margin: 0 }}>
            Learn more about the SSV Network
          </ActionButton>
        </LearnMoreLink>

        <BackLink onClick={onBackButtonClick}>Back</BackLink>
      </Grid>
    </Grid>
  );
};

export default observer(UpgradeSuccessState);
