import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import PrimaryButton from '~app/common/components/PrimaryButton';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import SecondaryButton from '~app/common/components/Button/SecondaryButton';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from './WhiteWrapper.styles';
import BackNavigation from '~app/common/components/BackNavigation';

type Props = {
    header: any,
    children: any,
    withCancel?: boolean,
    withSettings?: SettingsProps,
    withBackButton?: boolean,
};

type SettingsProps = {
    text: string,
    onClick: () => void,
};

const WhiteWrapper = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const { header, children, withCancel, withSettings, withBackButton = true } = props;
    const applicationStore: ApplicationStore = stores.Application;
    const settingsRef = useRef(null);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const cancelProcess = () => {
        applicationStore.cancelProcess();
        history.push(config.routes.MY_ACCOUNT.DASHBOARD);
    };

    const dialogHandler = () => {
        setOpenDialog(!openDialog);
    };

    const ShowSettings = () => {
        if (!showSettings || !withSettings) return null;
        const { text, onClick } = withSettings;
        return (
          <Grid ref={settingsRef} container item className={classes.Settings}>
            <Grid item className={classes.Button} onClick={onClick}>{text}</Grid>
          </Grid>
        );
    };

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

    return (
      <Grid container item className={classes.WhiteWrapper}>
        <Grid item container className={classes.Wrapper}>
          {header && (
            <Grid container item xs={12} alignItems={'center'}>
              {withBackButton && (
              <Grid item xs={12} className={classes.BackButtonWrapper}>
                <BackNavigation />
              </Grid>
            )}
              <Grid item container xs className={classes.HeaderWrapper}>
                <Grid item xs={6}>
                  <Typography>{header}</Typography>
                </Grid>
                {withCancel && (
                <Grid item xs={6}>
                  <Grid container item className={classes.CancelWrapper} onClick={dialogHandler}>
                    <Typography>Cancel</Typography>
                    <Grid item className={classes.CancelImage} />
                  </Grid>
                </Grid>
            )}
              </Grid>
              {withSettings && (
              <Grid item xs={6}>
                <Grid item className={classes.Options} onClick={() => {
                        setShowSettings(!showSettings);
                    }} />
                <Grid item className={classes.SettingsWrapper}>
                  <ShowSettings />
                </Grid>
              </Grid>
            )}
            </Grid>
        )}
          <Grid item xs={12} className={classes.ChildWrapper}>
            {children}
          </Grid>
          <Dialog
            open={openDialog}
            PaperProps={{
                  style: { borderRadius: 16, backgroundColor: 'transparent' },
              }}
          >
            <Grid container item className={classes.DialogWrapper}>
              <HeaderSubHeader title={'Cancel Update Operators'} subtitle={'Are you sure you want to cancel'} />
              <Grid container className={classes.ButtonsWrapper}>
                <Grid item xs>
                  <SecondaryButton text={'Yes, Cancel'} submitFunction={cancelProcess} />
                </Grid>
                <Grid item xs>
                  <PrimaryButton text={'No, Go Back'} submitFunction={dialogHandler} />
                </Grid>
              </Grid>
            </Grid>
          </Dialog>
        </Grid>

      </Grid>
    );
};

export default observer(WhiteWrapper);
