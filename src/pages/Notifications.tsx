import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonText, IonCheckbox, IonItem, IonList } from '@ionic/react';
import { add } from 'ionicons/icons';
import LocalNotificationCustom from '../model/LocalNotificationCustom';
import { useHistory } from 'react-router';
import { scheduleNotification, cancelNotifcation } from '../functions/functions';
import { Plugins } from '@capacitor/core';

const Notifications: React.FC<{
  notifications: LocalNotificationCustom[],
  setNotifications: Dispatch<SetStateAction<LocalNotificationCustom[]>>
}> = props => {
  const history = useHistory();
  const { setNotifications } = props;

  function toggleNotificationDoneStatus(notificationTobeCanceledOrRevoked: LocalNotificationCustom) {
    if (notificationTobeCanceledOrRevoked.done === true) {
      delete notificationTobeCanceledOrRevoked.doneTimestamp;
      scheduleNotification(notificationTobeCanceledOrRevoked);

    } else {
      notificationTobeCanceledOrRevoked.doneTimestamp = new Date();
      cancelNotifcation(notificationTobeCanceledOrRevoked)
    }
    notificationTobeCanceledOrRevoked.done = !notificationTobeCanceledOrRevoked.done
  }

  function openNotificationDetails(notification: LocalNotificationCustom, event: any) {
    if (event.target.nodeName !== 'ION-CHECKBOX') {
      history.push(`/notifications/notificationdetails/${notification.id}`)
    }
  }

  useEffect(() => {
    async function getNotificationsFromStorageAndSetProps() {
      const newNotificationArrayPromise = await Plugins.Storage.get({key: 'notifications'})
      const newNotificationArray = newNotificationArrayPromise.value ? JSON.parse(newNotificationArrayPromise.value) : [];
      setNotifications(newNotificationArray);
    }
    getNotificationsFromStorageAndSetProps()
  }, [setNotifications])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Erinnerungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Erinnerungen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {props.notifications.map((notification) => {
            if (!notification.doneTimestamp || Number(notification.doneTimestamp) + 1000 * 60 * 60 * 24 > Number(new Date())) {
              if (typeof notification.schedule?.at === 'string') {
                notification.schedule.at = new Date(notification.schedule?.at);
              }
              return (
                <IonItem key={notification.id} button onClick={e => openNotificationDetails(notification, e)}>
                  <IonCheckbox onIonChange={() => toggleNotificationDoneStatus(notification)}/>
                  <IonText class="ion-margin">{notification.title}</IonText>
                  <IonText slot="end">{notification.schedule?.at?.toLocaleDateString('de-DE', {year: 'numeric', month: 'numeric', day: 'numeric'})}</IonText>
                </IonItem>
              )
            } else {
              return <React.Fragment key={notification.id}></React.Fragment>
            }
          })}
        </IonList>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton routerLink="/notifications/addnotification">
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default React.memo(Notifications);
