import { LocalNotificationRequest, LocalNotificationPendingList, Plugins } from '@capacitor/core';
import LocalNotificationCustom from "../model/LocalNotificationCustom";

export function rescheduleNotification(notification: LocalNotificationCustom) {
  cancelNotifcation(notification);
  scheduleNotification(notification);
}

export function scheduleNotification(notification: LocalNotificationCustom) {
  Plugins.LocalNotifications.schedule({
    notifications: [
      notification
    ]
  });
}

export function cancelNotifcation(notification: LocalNotificationCustom) {
  const localNotificationRequest: LocalNotificationRequest[] = [ { id: notification.id.toString() } ]
  const localNotificationPendingList: LocalNotificationPendingList = { notifications: localNotificationRequest }
  Plugins.LocalNotifications.cancel(localNotificationPendingList)
}
