import React from 'react';
import { observer } from 'mobx-react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { useStyles } from './BarMessage.styles';
import { useStores } from '~app/hooks/useStores';
import NotificationsStore from '~app/common/stores/Notifications.store';

const Alert = (props: any) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const BarMessage = () => {
    const classes = useStyles();
    const stores = useStores();
    const notifications: NotificationsStore = stores.notifications;

    const handleClose = () => {
        notifications.setShowSnackBar(false);
    };
    return (
      <Snackbar open={notifications.showSnackBar} autoHideDuration={6000}>
        <Alert className={classes.messageBar} onClose={handleClose} severity={notifications.messageSeverity}>
          {notifications.message}
        </Alert>
      </Snackbar>
    );
};

export default observer(BarMessage);
