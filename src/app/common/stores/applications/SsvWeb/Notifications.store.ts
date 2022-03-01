import { action, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';

class NotificationsStore extends BaseStore {
  @observable autoHideDuration: number = 0;
  @observable message: string = '';
  @observable showSnackBar = false;
  @observable messageSeverity: string = '';

  @action.bound
  setShowSnackBar(status: boolean) {
    this.showSnackBar = status;
  }

  @action.bound
  setMessage(text: string) {
    this.message = text;
  }

  @action.bound
  setMessageSeverity(text: string) {
    this.messageSeverity = text;
  }

  @action.bound
  showMessage(message: string, severity: string, autoHideDuration?: number) {
    this.setShowSnackBar(true);
    this.setMessage(message);
    this.setMessageSeverity(severity);
    if (autoHideDuration) {
      this.setAutoHideDuration(autoHideDuration);
    }
  }

  @action.bound
  setAutoHideDuration(autoHideDuration: number) {
    this.autoHideDuration = autoHideDuration;
  }
}

export default NotificationsStore;
