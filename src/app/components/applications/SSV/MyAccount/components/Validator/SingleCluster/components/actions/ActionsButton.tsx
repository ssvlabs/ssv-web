import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { ProcessStore } from '~app/common/stores/applications/SsvWeb';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/actions/actions.styles';
import { Button } from '~app/components/ui/button';
import { useStores } from '~app/hooks/useStores';
import { BULK_FLOWS, SingleCluster } from '~app/model/processes.model';

const ActionsButton = () => {
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
      if (showActions && actionsRef.current && !actionsRef.current.contains(e.target)) {
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

  const [rect, setRect] = useState<Partial<DOMRect>>({});

  const onButtonClickHandler = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowActions(true);
    setRect((ev.currentTarget as HTMLButtonElement).getBoundingClientRect());
  };

  const goToBulkActions = (bulkFlow: BULK_FLOWS) => {
    process.currentBulkFlow = bulkFlow;
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK);
  };

  return (
    <Grid>
      <Button variant="secondary" onClick={onButtonClickHandler}>
        Actions <ChevronDown className="size-4" />
      </Button>
      {/* <SecondaryButton text={'Actions'} onClick={onButtonClickHandler} icon={'/images/arrowDown/arrow.svg'} size={ButtonSize.SM} /> */}
      {showActions && (
        <Grid
          item
          className={classes.SettingsWrapper}
          style={{
            top: (rect.bottom || 0) + 4,
            left: rect.left || 0
          }}
        >
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
