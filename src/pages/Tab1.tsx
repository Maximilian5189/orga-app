import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonButton, IonList, IonItem, IonLabel } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Plugins, LocalNotification } from '@capacitor/core';
import { add } from 'ionicons/icons';

const Tab1: React.FC = () => {

  const [notificationScreenOpen, setnotificationScreenOpen] = useState(false);
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);

  function toggleAddNotificationScreen() {
    setnotificationScreenOpen(!notificationScreenOpen)
  }

  async function addNotification() {
    await Plugins.LocalNotifications.requestPermission()

    const notification = {      
      id: notifications.length + 1,
      title: 'blub',
      body: 'Single LocalNotification'
    }

    setNotifications(notifications => [...notifications, notification])

    await Plugins.LocalNotifications.schedule({
      notifications: [
        notification
      ]
    });
  }

  let formContent;

  if (notificationScreenOpen) {
    formContent = 
      <React.Fragment>
        <IonButton onClick={() => addNotification()}>Erinnerung hinzufügen</IonButton>
        <IonButton onClick={() => toggleAddNotificationScreen()}>zurück</IonButton>
      </React.Fragment>
  } else {
    formContent = 
    <React.Fragment>
      <IonList>
      {notifications.map((notification, index) => {
        return (
          <IonItem key={index}>
            <IonLabel>{notification.title}</IonLabel>
            <p>Id: {notification.id}</p>
            <p>{notification.body}</p>
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
        <ExploreContainer name="Tab 1 page" />
        {formContent}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
