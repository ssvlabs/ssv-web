import { rootStore } from '~root/stores';
import NotificationsStore from '~app/common/stores/Notifications.store';

describe('Check Notification Store', () => {
    it('Check error message', () => {
        const message = 'this is message';
        const severity = 'error';
        const notification: NotificationsStore = rootStore.Notifications;
        notification.showMessage(message, severity);
        expect(notification.message).toEqual(message);
        expect(notification.messageSeverity).toEqual(severity);
        expect(notification.showSnackBar).toEqual(true);
    });
    it('Check success message', () => {
        const message = 'this is message';
        const severity = 'success';
        const notification: NotificationsStore = rootStore.Notifications;
        notification.showMessage(message, severity);
        expect(notification.message).toEqual(message);
        expect(notification.messageSeverity).toEqual(severity);
        expect(notification.showSnackBar).toEqual(true);
    });
});
