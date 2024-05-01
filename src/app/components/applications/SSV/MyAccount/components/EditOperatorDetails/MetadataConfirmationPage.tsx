import React from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import { SingleOperator } from '~app/model/processes.model';
import PrimaryButton from '~app/atomics/PrimaryButton';
import SecondaryButton from '~app/atomics/SecondaryButton';
import { ButtonSize } from '~app/enums/Button.enum';


const MetadataConfirmationPage = () => {
  const classes = useStyles({});
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperator = processStore.getProcess;
  const operator = process?.item;
  const navigate = useNavigate();

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator',
    });
    window.open(`${config.links.EXPLORER_URL}/operators/${operator.id}`, '_blank');
  };

  const goToDashboard = () => navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);

  return (
    <Grid className={classes.ConfirmationBox}>
      <Grid className={classes.ConfirmationWrapper}>
        <Grid item className={classes.BackgroundImage}/>
        <HeaderSubHeader
          marginBottom={13}
          title={translations.OPERATOR_METADATA.CONFIRMATION_CHANGE.TITLE}
          subtitle={translations.OPERATOR_METADATA.CONFIRMATION_CHANGE.SUBTITLE}
        />
        <Grid className={classes.ButtonGroup}>
          <Grid className={classes.buttonWidth}>
            <SecondaryButton text={translations.OPERATOR_METADATA.CONFIRMATION_CHANGE.EXPLORER_BUTTON}
                             onClick={openExplorer} size={ButtonSize.XL}/>
          </Grid>
          <Grid className={classes.buttonWidth}>
            <PrimaryButton text={translations.OPERATOR_METADATA.CONFIRMATION_CHANGE.RETURN_TO_MY_ACCOUNT}
                           onClick={goToDashboard} size={ButtonSize.XL}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MetadataConfirmationPage;
