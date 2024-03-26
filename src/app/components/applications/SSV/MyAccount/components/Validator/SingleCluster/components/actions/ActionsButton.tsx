import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { ProcessStore } from '~app/common/stores/applications/SsvWeb';
import SecondaryButton from '~app/components/common/Button/SecondaryButton/SecondaryButton';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/actions/actions.styles';
import { SingleCluster, BULK_FLOWS } from '~app/model/processes.model';

const ActionsButton = ({ extendClass, children }: { extendClass: string, children: string | JSX.Element }) => {
  const classes = useStyles();
  const actionsRef = useRef(null);
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;

  useEffect(() => {
    /**
     * Close menu drop down when click outside
     */
    const handleClickOutside = (e: any) => {
      // @ts-ignore
      if (showActions && actionsRef.current && (!actionsRef.current.contains(e.target))) {
        setShowActions(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionsRef, showActions]);

  const onButtonClickHandler = () => {
    setShowActions(true);
  };

  const goToBulkActions = (bulkFlow: BULK_FLOWS) => {
    process.currentBulkFlow = bulkFlow;
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK);
  };

  return (
    <Grid>
      <SecondaryButton children={children} className={extendClass} submitFunction={onButtonClickHandler}/>
      {showActions && <Grid item className={classes.SettingsWrapper}>
        <Grid ref={actionsRef} className={classes.Settings}>
          <Grid container item className={classes.Button} onClick={() => goToBulkActions(BULK_FLOWS.BULK_REMOVE)} style={{ justifyContent: 'space-between' }}>
            <Grid container item xs style={{ gap: 8, width: '100%' }}>
              <Grid className={classes.Remove} />
              <Typography>Remove Validators</Typography>
            </Grid>
          </Grid>
          <Grid container item className={classes.Button} onClick={() => goToBulkActions(BULK_FLOWS.BULK_EXIT)}>
            <Grid container item xs style={{ gap: 8, width: '100%' }}>
              <Grid className={classes.Exit}/>
              <Typography>Exit Validators</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      }
    </Grid>
  );
};

export default ActionsButton;
