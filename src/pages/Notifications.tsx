import React, { Dispatch, SetStateAction } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonText, IonCheckbox, IonItem, IonList } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Plugins, LocalNotificationRequest, LocalNotificationPendingList } from '@capacitor/core';
import { add } from 'ionicons/icons';
import LocalNotificationCustom from '../model/LocalNotificationCustom';
import { useHistory } from 'react-router';

// todo: Daten persistieren -> Browser in localStorage; wie für mobile?
const Notifications: React.FC<{
  notifications: LocalNotificationCustom[],
  setNotifications: Dispatch<SetStateAction<LocalNotificationCustom[]>>
}> = props => {
  const history = useHistory();

  function toggleNotificationDoneStatus(notificationTobeCanceledOrRevoked: LocalNotificationCustom, event: CustomEvent) {
    event.stopPropagation();
    if (notificationTobeCanceledOrRevoked.done === true) {
      delete notificationTobeCanceledOrRevoked.doneTimestamp;
      Plugins.LocalNotifications.schedule({
        notifications: [
          notificationTobeCanceledOrRevoked
        ]
      });
    } else {
      notificationTobeCanceledOrRevoked.doneTimestamp = new Date();
      const localNotificationRequest: LocalNotificationRequest[] = [ { id: notificationTobeCanceledOrRevoked.id.toString() } ]
      const localNotificationPendingList: LocalNotificationPendingList = { notifications: localNotificationRequest }
      Plugins.LocalNotifications.cancel(localNotificationPendingList)
    }
    notificationTobeCanceledOrRevoked.done = !notificationTobeCanceledOrRevoked.done
  }
  
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
        <ExploreContainer name="Erinnerungen" />
        <IonList>
          {props.notifications.map((notification) => {
            if (!notification.doneTimestamp || Number(notification.doneTimestamp) + 1000 * 60 * 60 * 24 > Number(new Date())) {
              return (
                // todo: Events kommen sich hier in die Quere
                <IonItem key={notification.id} onClick={() => history.push(`/notifications/notificationdetails/${notification.id}`)}>
                  <IonCheckbox onIonChange={e => toggleNotificationDoneStatus(notification, e)}/>
                  <IonText class="ion-margin">{notification.title}</IonText>
                  <IonText slot="end">{notification.schedule?.at?.toLocaleDateString('de-DE', {year: 'numeric', month: 'numeric', day: 'numeric'})}</IonText>
                </IonItem>
              )
            } else {
              return <React.Fragment></React.Fragment>
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

export default Notifications;
