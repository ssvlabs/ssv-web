import React from 'react';
import { observer } from 'mobx-react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './BarMessage.styles';

function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const BarMessage = () => {
    const classes = useStyles();
    const { message } = useStores();

    const handleClose = () => {
        message.setShowSnackBar(false);
    };
    return (
      <Snackbar open={message.showSnackBar} autoHideDuration={6000}>
        <Alert className={classes.messageBar} onClose={handleClose} severity={message.messageSeverity}>
          {message.message}
        </Alert>
      </Snackbar>
    );
};

export default observer(BarMessage);
