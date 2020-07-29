import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react';
import './Notes.css';

const Notes: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notizen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notizen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonText class="ion-margin">tbd</IonText>
      </IonContent>
    </IonPage>
  );
};

export default Notes;
