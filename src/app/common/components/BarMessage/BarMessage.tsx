import React from 'react';
import { observer } from 'mobx-react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { useStores } from '~app/hooks/useStores';
import NotificationsStore from '~app/common/stores/Notifications.store';
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
      anchorOrigin={snackbarAnchorOrigin}
      onClose={handleClose}
      open={notificationsStore.showSnackBar}
      autoHideDuration={notificationsStore.autoHideDuration || 5000}
    >
      <Alert
        className={classes.messageBar}
        onClose={handleClose}
        severity={notificationsStore.messageSeverity}
      >
        {notificationsStore.message}
      </Alert>
    </Snackbar>
  );
};

export default observer(BarMessage);
