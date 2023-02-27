import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStyles } from './ToggleDashboards.styles';
import Typography from '@mui/material/Typography';

type Props = {
  type?: string,
  title: string,
  changeState: any,
};

const ToggleDashboards = (props: Props) => {
  const { type, title, changeState } = props;
  const classes = useStyles({ isOperator: type === 'operator' });
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const settingsRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    /**
     * Close menu drop down when click outside
     */
    const handleClickOutside = (e: any) => {
      if (showSettings
          && settingsRef.current
          // @ts-ignore
          && (!settingsRef.current.contains(e.target))
          && textRef.current
          // @ts-ignore
          && (!textRef.current.contains(e.target))
          && imageRef.current
          // @ts-ignore
          && (!imageRef.current.contains(e.target))) {
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

  return (
      <Grid container item xs style={{ cursor: 'pointer' }}>
        <Typography ref={textRef} className={classes.Header} onClick={() => setShowSettings(!showSettings)}>{title}</Typography>
        <Grid ref={imageRef} className={classes.Arrow} onClick={() => setShowSettings(!showSettings)} />
        {
            showSettings && <Grid item className={classes.SettingsWrapper}>
              <Grid ref={settingsRef} container item className={classes.Settings}>
                <Grid container item className={classes.Button} onClick={()=>{changeState(2);}}>
                  <Grid className={classes.SettingsImage}/>
                  Operators
                </Grid>
                <Grid container item className={classes.Button} onClick={()=>{changeState(1);}}>
                  <Grid className={classes.SettingsImage}/>
                  Validators
                </Grid>
              </Grid>
            </Grid>
        }
      </Grid>
  );
};

export default observer(ToggleDashboards);
