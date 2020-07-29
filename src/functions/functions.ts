import { LocalNotificationRequest, LocalNotificationPendingList, Plugins } from '@capacitor/core';
import LocalNotificationCustom from "../model/LocalNotificationCustom";

export function rescheduleNotification(notification: LocalNotificationCustom) {
    const localNotificationRequest: LocalNotificationRequest[] = [ { id: notification.id.toString() } ]
    const localNotificationPendingList: LocalNotificationPendingList = { notifications: localNotificationRequest }
    Plugins.LocalNotifications.cancel(localNotificationPendingList)
    Plugins.LocalNotifications.schedule({
      notifications: [
        notification
      ]
    });
  }

export function deleteNotification() {
    
}