import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonButton, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonText, IonCheckbox, IonGrid, IonRow, IonCol } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Plugins, LocalNotificationRequest, LocalNotificationPendingList } from '@capacitor/core';
import { add } from 'ionicons/icons';

// Bei Klick auf Erinnerung neuen Screen öffnen mit Details --> dafür:
// Academind: Dynamic Routes
interface LocalNotificationCustom {
  title: string;
  id: number;
  body: string;
  schedule?: {
    repeats?: boolean;
    every?: 'day' | 'hour';
    at?: Date;
  }
  done: boolean;
}

const Tab1: React.FC = () => {

  enum fieldTypes {
    TITLE = 'title',
    BODY = 'body',
    DATE = 'date',
    REPEAT = 'repeat'
  }

  const [notificationScreenOpen, setnotificationScreenOpen] = useState(false);
  const [notifications, setNotifications] = useState<LocalNotificationCustom[]>([]);
  const [userInput, setUserInput] = useState<LocalNotificationCustom>({title: '', body: '', id: 0, done: false});

  function toggleAddNotificationScreen() {
    setnotificationScreenOpen(!notificationScreenOpen)
  }

  function handleUserInput(e: CustomEvent, fieldName: fieldTypes) {
    if (e.detail && e.detail.value) {
      if (fieldName === fieldTypes.TITLE) {
        setUserInput({...userInput, title: e.detail.value})
      } else if (fieldName === fieldTypes.BODY) {
        setUserInput({...userInput, body: e.detail.value})
      } else if (fieldName === fieldTypes.DATE) {
        e.detail.value = new Date(e.detail.value)
        setUserInput({...userInput, schedule: { at: e.detail.value }})
      } else if (fieldName === fieldTypes.REPEAT) {
        const repeats = e.detail.value ? true : false; 
        setUserInput({...userInput, schedule: { every: e.detail.value, repeats: repeats }})
      }
    }
  }

  async function addNotification() {
    await Plugins.LocalNotifications.requestPermission()

    const notification = {      
      id: notifications.length + 1,
      title: userInput.title,
      body: userInput.body,
      schedule: { at: userInput.schedule?.at, repeats: userInput.schedule?.repeats, every: userInput.schedule?.every },
      done: userInput.done
    }
    
    notifications.push(notification)
    notifications.sort((a, b) => Number(a.schedule?.at) - Number(b.schedule?.at))
    setNotifications(notifications)

    await Plugins.LocalNotifications.schedule({
      notifications: [
        notification
      ]
    });

    toggleAddNotificationScreen()
  }

  function cancelOrRevokeNotification(notificationTobeCanceledOrRevoked: LocalNotificationCustom) {
    if (notificationTobeCanceledOrRevoked.done === true) {
      Plugins.LocalNotifications.schedule({
        notifications: [
          notificationTobeCanceledOrRevoked
        ]
      });
    } else {
      const localNotificationRequest: LocalNotificationRequest[] = [ { id: notificationTobeCanceledOrRevoked.id.toString() } ]
      const localNotificationPendingList: LocalNotificationPendingList = { notifications: localNotificationRequest }
      Plugins.LocalNotifications.cancel(localNotificationPendingList)
    }
    notificationTobeCanceledOrRevoked.done = !notificationTobeCanceledOrRevoked.done
  }

  let formContent;

  if (notificationScreenOpen) {
    formContent = 
      <React.Fragment>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Titel</IonLabel>
            <IonInput type="text" onIonChange={e => handleUserInput(e, fieldTypes.TITLE)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Details</IonLabel>
            <IonInput type="text" onIonChange={e => handleUserInput(e, fieldTypes.BODY)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Zeitpunkt (DD/MM/YYYY HH:mm)</IonLabel>
            <IonDatetime displayFormat="DD MM YYYY HH:mm" cancel-text="Abbrechen" done-text="Fertig" max="2100" onIonChange={e => handleUserInput(e, fieldTypes.DATE)}></IonDatetime>
          </IonItem>
          <IonItem>
          <IonLabel position="floating">Wiederholen?</IonLabel>
            <IonSelect placeholder="Wähle eins aus" onIonChange={e => handleUserInput(e, fieldTypes.REPEAT)}>
              <IonSelectOption value="hour">Stündlich</IonSelectOption>
              <IonSelectOption value="day">Täglich</IonSelectOption>
              <IonSelectOption value="">Nein</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        <IonButton onClick={() => addNotification()}>Erinnerung hinzufügen</IonButton>
        <IonButton onClick={() => toggleAddNotificationScreen()}>zurück</IonButton>
      </React.Fragment>
  } else {
    formContent = 
    <React.Fragment>
      <IonGrid>
      {notifications.map((notification, index) => {
        let repeatPeriod;
        if (notification.schedule?.every === 'hour') {
          repeatPeriod = 'Stündlich';
        } else if (notification.schedule?.every === 'day') {
          repeatPeriod = 'Täglich';
        } else {
          repeatPeriod = 'Keiner'
        }
        return (
          <IonRow key={index}>
            <IonCol size="auto">
              <IonCheckbox onIonChange={() => cancelOrRevokeNotification(notification)}/>
            </IonCol>
            <IonCol size="auto">
              <IonText>{notification.title}</IonText>
            </IonCol>
            <IonCol size="auto">
              <IonText>{notification.schedule?.at?.toLocaleDateString('de-DE', {year: 'numeric', month: 'numeric', day: 'numeric'})}</IonText>
            </IonCol>
            {/* <IonText class="ion-margin">{notification.body}</IonText> */}
            {/* <IonText class="ion-margin">Wiederholungszeitraum: {repeatPeriod}</IonText> */}
            {/* <IonText class="ion-margin">Erledigt?</IonText> */}
          </IonRow>
        )
      })}
      </IonGrid>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => toggleAddNotificationScreen()}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </React.Fragment>
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
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Erinnerungen" />
        {formContent}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
