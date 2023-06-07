import { AlertColor } from '@mui/material/Alert';
import { action, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';

class NotificationsStore extends BaseStore {
  autoHideDuration: number = 0;
  message: string = '';
  showSnackBar = false;
  messageSeverity: AlertColor = 'info';

  constructor() {
    // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
    super();

    makeObservable(this, {
      message: observable,
      showSnackBar: observable,
      setMessage: action.bound,
      showMessage: action.bound,
      messageSeverity: observable,
      autoHideDuration: observable,
      setShowSnackBar: action.bound,
      setMessageSeverity: action.bound,
      setAutoHideDuration: action.bound,
    });
  }

  setShowSnackBar(status: boolean) {
    this.showSnackBar = status;
  }

  setMessage(text: string) {
    this.message = text;
  }

  setMessageSeverity(text: AlertColor) {
    this.messageSeverity = text;
  }

  showMessage(message: string, severity: AlertColor, autoHideDuration?: number) {
    this.setShowSnackBar(true);
    this.setMessage(message);
    this.setMessageSeverity(severity);
    if (autoHideDuration) {
      this.setAutoHideDuration(autoHideDuration);
    }
  }

  setAutoHideDuration(autoHideDuration: number) {
    this.autoHideDuration = autoHideDuration;
  }
}

export default NotificationsStore;
