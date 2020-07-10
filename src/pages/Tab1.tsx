import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonButton, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Plugins, LocalNotification } from '@capacitor/core';
import { add } from 'ionicons/icons';

class UserInput {
  title: string;
  body: string;
  date?: Date;
  repeats?: boolean;
  every?: 'day' | 'hour';

  constructor() {
    this.title = '';
    this.body = '';
  }
}

const Tab1: React.FC = () => {

  enum fieldTypes {
    TITLE = 'title',
    BODY = 'body',
    DATE = 'date',
    REPEAT = 'repeat'
  }

  const [notificationScreenOpen, setnotificationScreenOpen] = useState(false);
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [userInput, setUserInput] = useState<UserInput>(new UserInput());

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
        setUserInput({...userInput, date: e.detail.value})
      } else if (fieldName === fieldTypes.REPEAT) {
        const repeats = e.detail.value ? true : false; 
        setUserInput({...userInput, every: e.detail.value, repeats: repeats})
      }
    }
  }

  async function addNotification() {
    await Plugins.LocalNotifications.requestPermission()

    const notification = {      
      id: notifications.length + 1,
      title: userInput.title,
      body: userInput.body,
      schedule: { at: userInput.date, repeats: userInput.repeats, every: userInput.every }
    }

    setNotifications(notifications => [...notifications, notification])

    await Plugins.LocalNotifications.schedule({
      notifications: [
        notification
      ]
    });

    toggleAddNotificationScreen()
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
      <IonList>
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
          <IonItem key={index}>
            <IonLabel>{notification.title}</IonLabel>
            <IonText class="ion-margin">{notification.body}</IonText>
            <IonText class="ion-margin">Zeitpunkt: {notification.schedule?.at?.toString().replace('GMT+0200 (Mitteleuropäische Sommerzeit)', '').slice(0, -4)}</IonText>
            <IonText class="ion-margin">Wiederholungszeitraum: {repeatPeriod}</IonText>
          </IonItem>
        )
      })}
      </IonList>
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
