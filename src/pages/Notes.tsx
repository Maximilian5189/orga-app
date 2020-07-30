import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonList, IonItem, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import './Notes.css';
import Note from '../model/Note';
import { useHistory } from 'react-router';
import { add } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';

const Notes: React.FC<{
  notes: Note[],
  setNotes: Dispatch<SetStateAction<Note[]>>
}> = props => {
  const history = useHistory();
  const { setNotes } = props;

  useEffect(() => {
    async function getNotesFromStorageAndSetProps() {
      const newNotificationArrayPromise = await Plugins.Storage.get({key: 'notes'})
      const newNotificationArray = newNotificationArrayPromise.value ? JSON.parse(newNotificationArrayPromise.value) : [];
      setNotes(newNotificationArray);
    }
    getNotesFromStorageAndSetProps()
  }, [setNotes])

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
        <IonList>
          {props.notes.map((note) => {
            return (
              <IonItem key={note.id} button onClick={e => history.push(`/notes/notedetails/${note.id}`)}>
                <IonText class="ion-margin">{note.title}</IonText>
              </IonItem>
            );
          })}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton routerLink="/notes/addnote">
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Notes;
