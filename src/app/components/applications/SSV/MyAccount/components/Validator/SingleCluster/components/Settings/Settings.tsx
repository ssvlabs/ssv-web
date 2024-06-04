import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/Settings/Settings.styles';
import { getBeaconChainLink } from '~root/providers/networkInfo.provider';
import { SingleCluster, BULK_FLOWS } from '~app/model/processes.model';

const Settings = ({ validator, withoutSettings }: { validator: any; withoutSettings?: boolean }) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const settingsRef = useRef(null);
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    /**
     * Close menu drop down when click outside
     */
    const handleClickOutside = (e: any) => {
      // @ts-ignore
      if (showSettings && settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsRef, showSettings]);

  const openLink = (link: string) => {
    if (link) {
      GoogleTagManager.getInstance().sendEvent({
        category: 'external_link',
        action: 'click',
        label: 'change_operators'
      });
      window.open(link);
    }
  };

  const openBeaconcha = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha'
    });
    window.open(`${getBeaconChainLink()}/validator/${publicKey}`);
  };

  const openExplorer = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator'
    });
    window.open(`${config.links.EXPLORER_URL}/validators/${publicKey}`, '_blank');
  };

  const moveToRemoveValidator = (flow: BULK_FLOWS) => {
    process.validator = validator;
    process.currentBulkFlow = flow;
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK);
  };

  return (
    <Grid container className={classes.ExtraButtonsWrapper}>
      <ImageDiv onClick={() => openBeaconcha(validator.public_key)} image={'beacon'} width={24} height={24} />
      <ImageDiv onClick={() => openExplorer(validator.public_key)} image={'explorer'} width={24} height={24} />
      {!withoutSettings && <ImageDiv onClick={() => setShowSettings(true)} image={'setting'} width={24} height={24} />}
      {showSettings && (
        <Grid item className={classes.SettingsWrapper}>
          <Grid ref={settingsRef} container item className={classes.Settings}>
            <Grid container item className={classes.Button} onClick={() => openLink(config.links.UPDATE_OPERATORS_LINK)} style={{ justifyContent: 'space-between' }}>
              <Grid container item xs style={{ gap: 8 }}>
                <Grid item className={classes.ChangeOperatorsImage} />
                <Typography>Change Operators</Typography>
              </Grid>
              <Grid className={classes.ChangeOperatorsLinkImage} />
            </Grid>
            <Grid container item className={classes.Button} onClick={() => moveToRemoveValidator(BULK_FLOWS.BULK_REMOVE)}>
              <Grid className={classes.RemoveValidatorImage} />
              <Typography>Remove Validator</Typography>
            </Grid>
            <Grid container item className={classes.Button} onClick={() => moveToRemoveValidator(BULK_FLOWS.BULK_EXIT)}>
              <Grid className={classes.ExitValidatorImage} />
              <Typography>Exit Validator</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default observer(Settings);
