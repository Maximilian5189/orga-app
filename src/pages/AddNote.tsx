import React, { useState, Dispatch, SetStateAction } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonInput, IonButtons, IonBackButton, IonTextarea } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import Note from '../model/Note';
import { useHistory } from 'react-router';
import { FieldTypes } from '../model/Fieldtypes';
import { getNewNoteOrNotificationId } from '../functions/functions';

const AddNote: React.FC<{
  notes: Note[],
  setNotes: Dispatch<SetStateAction<Note[]>>
}> = props => {

  const [userInput, setUserInput] = useState<Note>({title: '', body: '', id: 0});
  const history = useHistory();

  function handleUserInput(e: CustomEvent, fieldName: FieldTypes) {
    if (e.detail && e.detail.value) {
      if (fieldName === FieldTypes.TITLE) {
        setUserInput({...userInput, title: e.detail.value})
      } else if (fieldName === FieldTypes.BODY) {
        setUserInput({...userInput, body: e.detail.value})
      }
    }
  }

  async function addNote() {
    const note = {      
      id: getNewNoteOrNotificationId(props.notes),
      title: userInput.title,
      body: userInput.body,
    };
    
    const newNoteArray = props.notes.slice();
    newNoteArray.push(note);
    props.setNotes(newNoteArray);
    Plugins.Storage.set({key: 'notes', value: JSON.stringify(newNoteArray)})

    setUserInput({title: '', body: '', id: 0});
    history.push("/notes");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notizen</IonTitle>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notizen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Titel</IonLabel>
            <IonInput type="text" value={userInput.title} onIonChange={e => handleUserInput(e, FieldTypes.TITLE)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Details</IonLabel>
            <IonTextarea autoGrow={true} value={userInput.body} onIonChange={e => handleUserInput(e, FieldTypes.BODY)}></IonTextarea>
          </IonItem>
        </IonList>
        <IonButton onClick={() => addNote()}>Notiz hinzufügen</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddNote;
