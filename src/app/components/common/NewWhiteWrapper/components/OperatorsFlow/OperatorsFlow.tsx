import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { useStyles } from './OperatorsFlow.styles';
import LinkText from '~app/components/common/LinkText/LinkText';

type Props = {
  header: string,
};

const OperatorsFlow = (props: Props) => {
  const { header } = props;
  const classes = useStyles();
  const settingsRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    /**
     * Close menu drop down when click outside
     */
    const handleClickOutside = (e: any) => {
      // @ts-ignore
      if (showSettings && settingsRef.current && (!settingsRef.current.contains(e.target))) {
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

  const onClick = () => console.log;

  return (
      <Grid container item>
        <Grid container item xs={11} style={{  alignItems: 'center', textAlign: 'center' }}>
          <Grid item className={classes.BackNavigation} />
          <Grid item className={classes.HeaderText}>{header}</Grid>
          <Grid item className={classes.CompleteProfile}>
            Complete your operator profile to increase discoverability and attract more stakers.
            <LinkText text={'Fill Details'}/>
          </Grid>
        </Grid>
        <Grid container item xs style={{ justifyContent: 'flex-end' }}>
          <Grid item className={classes.Options} onClick={() => {
            setShowSettings(!showSettings);
          }}/>
          {showSettings && <Grid item className={classes.SettingsWrapper}>
            <Grid ref={settingsRef} container item className={classes.Settings}>
              <Grid container item className={classes.Button} onClick={onClick}>
                <Grid className={classes.SettingsImage}/>
                <Typography>Access setting</Typography>
              </Grid>
              <Grid container item className={classes.Button} onClick={onClick}>
                <Grid className={classes.MetadataImage}/>
                <Typography>Metadata</Typography>
              </Grid>
              <Grid container item className={classes.Button} onClick={onClick}>
                <Grid className={classes.RemoveImage}/>
                <Typography>Remove Operator</Typography>
              </Grid>
            </Grid>
          </Grid>}
        </Grid>
      </Grid>
  );
};

export default observer(OperatorsFlow);
