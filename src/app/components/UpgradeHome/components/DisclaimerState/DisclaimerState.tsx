import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import UpgradeStore, { UpgradeSteps } from '~app/common/stores/Upgrade.store';
import { ActionButton } from '~app/components/UpgradeHome/components/ConversionState/ConversionState';
import { useStyles } from '~app/components/UpgradeHome/components/ConversionState/ConversionState.styles';

const DisclaimerRow = styled.div`
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  color: #5B6C84;
  margin-bottom: 30px;
`;

const DisclaimerHeader = styled.div`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  padding-right: 10px;
`;

const DisclaimerText = styled.div`
  display: inline-block;
`;

const DisclaimerState = () => {
  const classes = useStyles();
  const stores = useStores();
  const upgradeStore: UpgradeStore = stores.Upgrade;

  const onAgreeButtonClick = () => {
    upgradeStore.setUserAgreedOnTerms(true);
    upgradeStore.setStep(UpgradeSteps.confirmTransaction);
    window.scrollTo(0, 0);
  };

  return (
    <Grid container spacing={0} justify="center" className={classes.root}>
      <Grid item xs={12} md={12} lg={12}>
        <DisclaimerRow>
          <DisclaimerText>
            <DisclaimerHeader>NO REVERSIBILITY.</DisclaimerHeader>
            Your CDT Tokens will be upgraded to SSV Tokens based on a predetermined fixed ratio of 1 CDT = 100 SSV (the
            &quot;SSV Upgrade&quot;). The SSV Upgrade will be final and irreversible and you will not be able to
            retrieve your
            CDTs after clicking &quot;UPGRADE&quot;.
          </DisclaimerText>
        </DisclaimerRow>

        <DisclaimerRow>
          <DisclaimerText>
            <DisclaimerHeader>NO WARRANTY.</DisclaimerHeader>
            The SSV Upgrade is an entirely open-source code provided by Coin-dash Ltd
            (&quot;Coin-dash&quot; or &quot;We&quot;) on an
            &quot;as-is&quot; and &quot;as-available&quot; basis without any warranty whatsoever. Although the SSV
            Upgrade is audited by an
            unaffiliated third-party, the code may contain bugs, errors, defects and vulnerabilities that may result in
            you incurring severe loss and damages, including failing to complete the SSV Upgrade or losing all of your
            funds.
          </DisclaimerText>
        </DisclaimerRow>

        <DisclaimerRow>
          <DisclaimerText>
            <DisclaimerHeader>NO LIABILITY.</DisclaimerHeader>
            The SSV Upgrade will be done at your own risk and you will solely be responsible for any loss or damage that
            result from the SSV Upgrade. We shall not be liable under no circumstances for any or all loss or damage
            arising from or relating to the SSV Upgrade, and you further expressly waive and release Coin-dash from such
            loss or damages if occurred.
          </DisclaimerText>
        </DisclaimerRow>

        <DisclaimerRow>
          <DisclaimerText>
            <DisclaimerHeader>UPGRADE IS OPTIONAL.</DisclaimerHeader>
            The SSV Upgrade is a technical version update to the CDT Tokens meant to add new features and
            functionalities and allow users to participate in the SSV Platform. The SSV Upgrade is strictly voluntary
            and optional. It does not constitute a redemption, distribution, allocation, payment, &quot;airdrop&quot; or
            sale of
            tokens, or a solicitation, recommendation or offering in respect of any of the above.
          </DisclaimerText>
        </DisclaimerRow>

        <DisclaimerRow>
          <DisclaimerText>
            <DisclaimerHeader>LEGAL AND LEGITIMATE USE.</DisclaimerHeader>
            You hereby represent that you are not and have not been involved, directly or indirectly, in any type of
            activity associated with money laundering or terror financing, bribery, corruption, trafficking, narcotics,
            fraud, organized crime, unlicensed gambling, pornographic content, firearms or any other illicit activities,
            nor have you been subject to any investigation with respect to the above matters. You hereby warrant not to
            use the SSV Tokens to finance, engage in, or otherwise support any unlawful activities.
          </DisclaimerText>
        </DisclaimerRow>

        <DisclaimerRow>
          <DisclaimerText>
            <DisclaimerHeader>PERMITTED TRANSACTION.</DisclaimerHeader>
            You are not, or operating on behalf of (i) a resident or domiciliary of any territory that is subject to
            mandatory sanctions or embargoes by the United States, European Union or Israel (&quot;Sanction
            Lists&quot;); or (ii)
            an entity that is included on any Sanction Lists. You are also not residing in any territory that prohibits
            crypto assets activities.
          </DisclaimerText>
        </DisclaimerRow>

        <DisclaimerRow>
          <DisclaimerText>Last updated on 10.08.21</DisclaimerText>
        </DisclaimerRow>

        <ActionButton onClick={onAgreeButtonClick}>I Agree</ActionButton>
      </Grid>
    </Grid>
  );
};

export default observer(DisclaimerState);
