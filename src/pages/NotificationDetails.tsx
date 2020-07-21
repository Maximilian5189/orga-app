import React, { SetStateAction, Dispatch } from 'react';
import { useParams } from 'react-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButtons, IonBackButton } from '@ionic/react';
import LocalNotificationCustom from '../model/LocalNotificationCustom';

// todo: Notification editieren: https://pro.academind.com/courses/789970/lectures/14341713

const NotificationDetails: React.FC<{
  notifications: LocalNotificationCustom[],
  setNotifications: Dispatch<SetStateAction<LocalNotificationCustom[]>>
}> = props => {
  const notificationId = useParams<{notificationId: string}>().notificationId;
  const selectedNotification = props.notifications?.find(notification => notification.id.toString() === notificationId)
  let repeatPeriod;
  if (selectedNotification?.schedule?.every === 'hour') {
    repeatPeriod = 'Stündlich';
  } else if (selectedNotification?.schedule?.every === 'day') {
    repeatPeriod = 'Täglich';
  } else {
    repeatPeriod = 'Keiner'
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Id: {notificationId}</IonTitle>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Erinnnerungsdetails</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonText class="ion-margin">{selectedNotification?.body}</IonText>
        <IonText class="ion-margin">Wiederholungszeitraum: {repeatPeriod}</IonText>
      </IonContent>
    </IonPage>
  )
}

export default NotificationDetails