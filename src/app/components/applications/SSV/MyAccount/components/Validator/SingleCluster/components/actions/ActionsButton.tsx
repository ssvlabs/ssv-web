import { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/actions/actions.styles';
import { BULK_FLOWS } from '~app/enums/bulkFlow.enum.ts';
import { SecondaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';

const ActionsButton = () => {
  const classes = useStyles();
  const actionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    /**
     * Close menu drop down when click outside
     */
    const handleClickOutside = (e: MouseEvent) => {
      if (showActions && actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
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
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK, { state: { currentBulkFlow: bulkFlow } });
  };

  return (
    <Grid>
      <SecondaryButton text={'Actions'} onClick={onButtonClickHandler} icon={'/images/arrowDown/arrow.svg'} size={ButtonSize.SM} />
      {showActions && (
        <Grid item className={classes.SettingsWrapper}>
          <Grid ref={actionsRef} className={classes.Settings}>
            <Grid container item className={classes.Button} onClick={() => goToBulkActions(BULK_FLOWS.BULK_REMOVE)} style={{ justifyContent: 'space-between' }}>
              <Grid container item xs style={{ gap: 8, width: '100%' }}>
                <Grid className={classes.Remove} />
                <Typography>Remove Validators</Typography>
              </Grid>
            </Grid>
            <Grid container item className={classes.Button} onClick={() => goToBulkActions(BULK_FLOWS.BULK_EXIT)}>
              <Grid container item xs style={{ gap: 8, width: '100%' }}>
                <Grid className={classes.Exit} />
                <Typography>Exit Validators</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ActionsButton;
