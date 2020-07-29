import React, { useState, Dispatch, SetStateAction } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonButtons, IonBackButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Plugins } from '@capacitor/core';
import LocalNotificationCustom from '../model/LocalNotificationCustom';
import { useHistory } from 'react-router';
import { FieldTypes } from '../model/Fieldtypes';

// todo: Daten persistieren -> Browser in localStorage; wie für mobile?
const AddNotification: React.FC<{
  notifications: LocalNotificationCustom[],
  setNotifications: Dispatch<SetStateAction<LocalNotificationCustom[]>>
}> = props => {

  const [userInput, setUserInput] = useState<LocalNotificationCustom>({title: '', body: '', id: 0, done: false});
  const history = useHistory();

  function handleUserInput(e: CustomEvent, fieldName: FieldTypes) {
    if (e.detail && e.detail.value) {
      if (fieldName === FieldTypes.TITLE) {
        setUserInput({...userInput, title: e.detail.value})
      } else if (fieldName === FieldTypes.BODY) {
        setUserInput({...userInput, body: e.detail.value})
      } else if (fieldName === FieldTypes.DATE) {
        e.detail.value = new Date(e.detail.value)
        setUserInput({...userInput, schedule: { at: e.detail.value }})
      } else if (fieldName === FieldTypes.REPEAT) {
        const repeats = e.detail.value ? true : false; 
        setUserInput({...userInput, schedule: { every: e.detail.value, repeats: repeats }})
      }
    }
  }

  async function addNotification() {
    await Plugins.LocalNotifications.requestPermission()

    const notification = {      
      id: props.notifications.length + 1,
      title: userInput.title,
      body: userInput.body,
      schedule: { at: userInput.schedule?.at, repeats: userInput.schedule?.repeats, every: userInput.schedule?.every },
      done: userInput.done
    }
    
    const newNotificationArray = props.notifications.slice();
    newNotificationArray.push(notification);
    newNotificationArray.sort((a, b) => Number(a.schedule?.at) - Number(b.schedule?.at))
    props.setNotifications(newNotificationArray)

    await Plugins.LocalNotifications.schedule({
      notifications: [
        notification
      ]
    });

    history.push("/notifications")
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Erinnerungen</IonTitle>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
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
          <IonItem>
            <IonLabel position="floating">Titel</IonLabel>
            <IonInput type="text" onIonChange={e => handleUserInput(e, FieldTypes.TITLE)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Details</IonLabel>
            <IonInput type="text" onIonChange={e => handleUserInput(e, FieldTypes.BODY)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Zeitpunkt (DD/MM/YYYY HH:mm)</IonLabel>
            <IonDatetime displayFormat="DD MM YYYY HH:mm" cancel-text="Abbrechen" done-text="Fertig" max="2100" onIonChange={e => handleUserInput(e, FieldTypes.DATE)}></IonDatetime>
          </IonItem>
          <IonItem>
          <IonLabel position="floating">Wiederholen?</IonLabel>
            <IonSelect placeholder="Wähle eins aus" onIonChange={e => handleUserInput(e, FieldTypes.REPEAT)}>
              <IonSelectOption value="hour">Stündlich</IonSelectOption>
              <IonSelectOption value="day">Täglich</IonSelectOption>
              <IonSelectOption value="">Nein</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        <IonButton onClick={() => addNotification()}>Erinnerung hinzufügen</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddNotification;
