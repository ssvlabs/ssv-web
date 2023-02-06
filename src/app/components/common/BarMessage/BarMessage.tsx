import React from 'react';
import { observer } from 'mobx-react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useStores } from '~app/hooks/useStores';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './BarMessage.styles';

const Alert = (props: any) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const BarMessage = () => {
  const classes = useStyles();
  const stores = useStores();
  const notificationsStore: NotificationsStore = stores.Notifications;
  const snackbarAnchorOrigin: any = { vertical: 'top', horizontal: 'center' };

  const handleClose = () => {
    notificationsStore.setShowSnackBar(false);
  };

  return (
    <Snackbar
      onClose={handleClose}
      anchorOrigin={snackbarAnchorOrigin}
      open={notificationsStore.showSnackBar}
      autoHideDuration={notificationsStore.autoHideDuration || 5000}
    >
      <Alert
        onClose={handleClose}
        className={classes.messageBar}
        severity={notificationsStore.messageSeverity}
      >
        {notificationsStore.message}
      </Alert>
    </Snackbar>
  );
};

export default observer(BarMessage);
