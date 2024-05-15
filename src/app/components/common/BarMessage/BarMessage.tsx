
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useStyles } from './BarMessage.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { clearMessage, getMessageAndSeverity } from '~app/redux/notifications.slice';

const AUTO_HIDE_DURATION = 5000;

const BarMessage = () => {
  const classes = useStyles();
  const { message, severity } = useAppSelector(getMessageAndSeverity);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(clearMessage());
  };

  return (
    <Snackbar
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={!!message}
      autoHideDuration={AUTO_HIDE_DURATION}
    >
      <Alert onClose={handleClose} className={classes.messageBar} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default BarMessage;
