import React, { SetStateAction, Dispatch, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonLabel, IonItem, IonInput, IonDatetime, IonSelect, IonSelectOption, IonAlert, IonButton } from '@ionic/react';
import LocalNotificationCustom from '../model/LocalNotificationCustom';
import { FieldTypes } from '../model/Fieldtypes';
import { LocalNotificationRequest, LocalNotificationPendingList, Plugins } from '@capacitor/core';

// todo: refactor noch was möglich? Dann Funktionen auslagern
const NotificationDetails: React.FC<{
  notifications: LocalNotificationCustom[],
  setNotifications: Dispatch<SetStateAction<LocalNotificationCustom[]>>
}> = props => {
  const notificationId = useParams<{notificationId: string}>().notificationId;
  const selectedNotification = props.notifications?.find(notification => notification.id.toString() === notificationId)
  const [notificationDateString, setNotificationDateString] = useState('');
  const [startedDeletingNotification, setStartedDeletingNotification] = useState(false);
  const history = useHistory();

  function handleUserInput(e: CustomEvent, fieldName: FieldTypes) {
    const newNotificationArray = props.notifications?.map(notification => {
      if (notification.id.toString() === notificationId) {
        if (fieldName === FieldTypes.DATE && notification.schedule) {
          notification.schedule.at = new Date(e.detail.value);
          setNotificationDateString(e.detail.value);
          rescheduleNotification(notification);
        } else if (fieldName === FieldTypes.REPEAT && notification.schedule) {
          notification.schedule.every = e.detail.value;
          notification.schedule.repeats = e.detail.value ? true : false;
          rescheduleNotification(notification);
        } else if (fieldName === FieldTypes.BODY || fieldName === FieldTypes.TITLE) {
          notification[fieldName] = e.detail.value;
        }
      }
      return notification
    })
    props.setNotifications(newNotificationArray)
  }

  // todo
  async function rescheduleNotification(notification: LocalNotificationCustom) {
    await cancelNotifcation(notification);
    await scheduleNotification(notification);
  }

  function cancelNotifcation(notification: LocalNotificationCustom) {
    const localNotificationRequest: LocalNotificationRequest[] = [ { id: notification.id.toString() } ]
    const localNotificationPendingList: LocalNotificationPendingList = { notifications: localNotificationRequest }
    Plugins.LocalNotifications.cancel(localNotificationPendingList)
  }

  function scheduleNotification(notification: LocalNotificationCustom) {
    Plugins.LocalNotifications.schedule({
      notifications: [
        notification
      ]
    });
  }

  function deleteNotification() {
    props.notifications?.forEach((notification, index) => {
      if (notification.id.toString() === notificationId) {
        const newNotificationArray = props.notifications.slice(index, index)
        props.setNotifications(newNotificationArray)
        cancelNotifcation(notification);
      }
    });
  }

  useEffect(() => {
    props.notifications?.forEach(notification => {
      if (notification.id.toString() === notificationId && notification?.schedule?.at) {
        setNotificationDateString(notification.schedule.at.toString());
      }
    });
  },
  [notificationId, props.notifications])
  
  return (
    <React.Fragment>
      <IonAlert 
        isOpen={startedDeletingNotification} 
        header="Sicher?" 
        message="Die Erinnerung wird hierdurch entgültig gelöscht."
        buttons={[
          {
            text: "Nein",
            role: "cancel",
            handler: () => {
              setStartedDeletingNotification(false)
            }
          },
          {
            text: "Ja",
            handler: () => {
              deleteNotification()
              setStartedDeletingNotification(false)
              history.push("/notifications")
            }
          }
        ]}/>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{selectedNotification?.title}</IonTitle>
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
          <IonList>
            <IonItem>
              <IonLabel position="floating">Titel</IonLabel>
              <IonInput type="text" value={selectedNotification?.title} onIonChange={e => handleUserInput(e, FieldTypes.TITLE)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Details</IonLabel>
              <IonInput type="text" value={selectedNotification?.body} onIonChange={e => handleUserInput(e, FieldTypes.BODY)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Zeitpunkt (DD/MM/YYYY HH:mm)</IonLabel>
              <IonDatetime displayFormat="DD MM YYYY HH:mm" cancel-text="Abbrechen" done-text="Fertig" max="2100" value={notificationDateString} onIonChange={e => handleUserInput(e, FieldTypes.DATE)}></IonDatetime>
            </IonItem>
            <IonItem>
            <IonLabel position="floating">Wiederholungszeitraum:</IonLabel>
            <IonSelect placeholder="Wähle eins aus" value={selectedNotification?.schedule?.every} onIonChange={e => handleUserInput(e, FieldTypes.REPEAT)}>
              <IonSelectOption value="hour">Stündlich</IonSelectOption>
              <IonSelectOption value="day">Täglich</IonSelectOption>
              <IonSelectOption value="">Nein</IonSelectOption>
            </IonSelect>
            </IonItem>
            <IonItem>
              <IonButton onClick={() => setStartedDeletingNotification(true)}>Erinnerung löschen</IonButton>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    </React.Fragment>
  )
}

export default NotificationDetails