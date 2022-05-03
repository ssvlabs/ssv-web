import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from './WhiteWrapper.styles';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import SecondaryButton from '~app/common/components/SecondaryButton';
import PrimaryButton from '~app/common/components/PrimaryButton';

const WhiteWrapper = ({ children, header, withCancel = true }: any) => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const applicationStore: ApplicationStore = stores.Application;
    const [openDialog, setOpenDialog] = React.useState(false);

    const cancelProcess = () => {
        applicationStore.cancelProcess();
        history.push(config.routes.MY_ACCOUNT.DASHBOARD);
    };

    const dialogHandler = () => {
        setOpenDialog(!openDialog);
    };

    return (
      <Grid container item className={classes.WhiteWrapper}>
        {header && (
        <Grid container item xs={12} alignItems={'center'}>
          <Grid item xs={6} className={classes.HeaderWrapper}>
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
        )}
        <Grid item xs={12}>
          {children}
        </Grid>
        <Dialog
          open={openDialog}
          PaperProps={{
                  style: { borderRadius: 16 },
              }}
          >
          <Grid container item className={classes.DialogWrapper}>
            <HeaderSubHeader title={'Cancel Update Operators'} subtitle={'Are you sure you want to cancel'} />
            <Grid container className={classes.ButtonsWrapper}>
              <Grid item xs>
                <SecondaryButton text={'Yes, Cancel'} onClick={cancelProcess} />
              </Grid>
              <Grid item xs>
                <PrimaryButton text={'No, Go Back'} submitFunction={dialogHandler} />
              </Grid>
            </Grid>
          </Grid>
        </Dialog>
      </Grid>
    );
};

export default observer(WhiteWrapper);
