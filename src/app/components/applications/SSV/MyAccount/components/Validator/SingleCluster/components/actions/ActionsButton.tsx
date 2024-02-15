import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import SecondaryButton from '~app/components/common/Button/SecondaryButton/SecondaryButton';
import config from '~app/common/config';
import Typography from '@mui/material/Typography';
import { useStyles } from './actions.styles';
import { useNavigate } from 'react-router-dom';

const ActionsButton = ({ extendClass, children }: { extendClass: string, children: string | JSX.Element }) => {
  const classes = useStyles();
  const actionsRef = useRef(null);
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

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
  const goToBulkRemove = () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK_REMOVE);

  return (
    <Grid>
      <SecondaryButton children={children} className={extendClass} submitFunction={onButtonClickHandler}/>
      {showActions && <Grid item className={classes.SettingsWrapper}>
        <Grid ref={actionsRef} className={classes.Settings}>
          <Grid container item className={classes.Button} onClick={goToBulkRemove} style={{ justifyContent: 'space-between' }}>
            <Grid container item xs>
              <Typography>Remove Validators</Typography>
            </Grid>
          </Grid>
          <Grid container item className={classes.Button} onClick={() => console.log('1')}>
            <Grid container item xs style={{ gap: 8, width: '100%' }}>
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