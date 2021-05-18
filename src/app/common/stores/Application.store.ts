import { action, computed, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import NotificationsStore from '~app/common/stores/Notifications.store';

/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */
class ApplicationStore extends BaseStore {
  @observable isShowingLoading: boolean = false;

  @action.bound
  setIsLoading(status: boolean) {
    this.isShowingLoading = status;
  }

  @computed
  get isLoading() {
    return this.isShowingLoading;
  }

  /**
   * Handle error appeared in any of the stores
   * @param error
   * @param args
   */
  displayUserError(error: any, ...args: any) {
    if (error?.message) {
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      notificationsStore.showMessage(error?.message, 'error');
      console.debug('Error Occurred:', { error, ...args });
      this.setIsLoading(false);
    }
  }
}

export default ApplicationStore;
