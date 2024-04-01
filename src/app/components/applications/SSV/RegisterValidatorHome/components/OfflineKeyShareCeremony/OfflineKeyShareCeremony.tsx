import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import BackNavigation from '~app/components/common/BackNavigation';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/OfflineKeyShareCeremony/OfflineKeyShareCeremony.styles';
import DirectoryBadge
  from '~app/components/applications/SSV/RegisterValidatorHome/components/OfflineKeyShareCeremony/DirectoryBadge/DirectoryBadge';
import { getLaunchpadLink } from '~root/providers/networkInfo.provider';
import styled from 'styled-components';

const BoldText = styled.span`
   font-weight: 800;
`;

const OfflineKeyShareCeremony = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const processStore: ProcessStore = stores.Process;

  // State to manage button enable/disable condition
  const [isValidatorActivated, setValidatorActivated] = useState(false);

  const goToNextPage = {
    true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES),
    false: () => navigate(config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.UPLOAD_KEYSHARES),
  };

  // Handler when "My validator has been activated" is clicked
  const handleValidatorActivatedClick = () => {
    setValidatorActivated(true);
  };

  return (
    <Grid container className={classes.CeremonyContainerWrapper}>
      <Grid item className={classes.BackButtonWrapper}>
        <BackNavigation/>
      </Grid>
      <Grid className={classes.TitleBox}>
        DKG Ceremony Summary
      </Grid>
      <Grid className={classes.TitleBox}>
        <Grid container item className={classes.DkgInstructionsWrapper}>
          <Grid className={classes.StepAndBadgeWrapper}>
            <Typography className={classes.DkgTitle}><Typography className={classes.StepTitle}>Step
              1:</Typography>&nbsp;Validator Key Generation</Typography>
            <Grid className={classes.CompletedBadge}>
              <Typography className={classes.CompletedBadgeText}>Completed</Typography>
              <Grid className={classes.CompletedIcon}/>
            </Grid>
          </Grid>
          <Typography className={classes.DkgText}>
            Following the successful completion of the ceremony, several files have been generated and placed in the
            <DirectoryBadge directoryPath={'ceremony-[timestamp]/[owner-nonce]-[validator-pubkey]'}/>. folder under the directory the
            command was initiated:
          </Typography>
          <Grid className={classes.DkgNotification}>
            <Grid>
              <code className={classes.DkgCode}>deposit_data.json</code>
              <Typography className={classes.DkgCodeText}> This file contains the deposit data needed to activate your
                validator on the Beacon Chain.</Typography>
            </Grid>
            <Grid>
              <code
                className={classes.DkgCode}>keyshares.json</code>
              <Typography className={classes.DkgCodeText}> This file contains the keyshares necessary to register your
                validator on the SSV Network.</Typography>
            </Grid>
            <Grid>
              <code className={classes.DkgCode}>proofs.json</code>
              <Typography className={classes.DkgCodeText}>This file contains the signatures indicating that the
                ceremony was conducted by the cluster operators and is <BoldText>crucial for resharing</BoldText> your validator with a
                different set of operators in the future. Please ensure to <BoldText>back up</BoldText> this file securely.</Typography>
            </Grid>
            <Grid className={classes.Line}/>
            <Typography className={classes.DkgCodeText}>For ceremonies generating more than one validator, you will find
              aggregated versions of all the previously mentioned files within the <DirectoryBadge
                directoryPath={'ceremony-[timestamp]'}/> folder.</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid className={`${classes.TitleBox} ${!isValidatorActivated ? classes.SelectedBoxBorder : null}`}>
        <Grid container item className={classes.DkgInstructionsWrapper}>
          <Grid className={classes.StepAndBadgeWrapper}>
            <Typography className={classes.DkgTitle}><Typography className={classes.StepTitle}>Step
              2:</Typography>&nbsp;Deposit Validator</Typography>
            {isValidatorActivated && <Grid className={classes.CompletedBadge}>
              <Typography className={classes.CompletedBadgeText}>Completed</Typography>
              <Grid className={classes.CompletedIcon}/>
            </Grid>}
          </Grid>
          <Grid className={classes.DkgText}>
            Activate your validator on the Beacon Chain by depositing 32 ETH into Ethereum's Deposit Contract.
            You can deposit your validator using <LinkText text={'Ethereum\'s LaunchPad'}
                                                           link={getLaunchpadLink()}/>&nbsp;or
            refer to the <LinkText text={'validator activation'}
                                   link={'https://docs.ssv.network/validator-user-guides/validator-management/creating-a-new-validator#activate-validator-keys'}/>&nbsp;guide
            for assistance.
          </Grid>
          <PrimaryButton children={'My validator has been activated'} submitFunction={handleValidatorActivatedClick}
                         disable={isValidatorActivated}/>
        </Grid>
      </Grid>
      <Grid className={`${classes.TitleBox} ${isValidatorActivated ? classes.SelectedBoxBorder : null}`}>
        <Grid container item className={classes.DkgInstructionsWrapper}>
          <Typography className={classes.DkgTitle}><Typography className={classes.StepTitle}>Step
            3:</Typography>&nbsp;Register Validator</Typography>
          <Typography className={classes.DkgText}>Run your validator on the SSV Network by registering and distributing
            its key shares to your cluster operators.</Typography>
          <PrimaryButton children={'Register Validator'} submitFunction={goToNextPage[`${processStore.secondRegistration}`]}
                         disable={!isValidatorActivated}/>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default observer(OfflineKeyShareCeremony);
