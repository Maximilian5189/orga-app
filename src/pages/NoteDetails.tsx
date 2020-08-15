import React, { SetStateAction, Dispatch, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonLabel, IonItem, IonInput, IonAlert, IonButton, IonTextarea } from '@ionic/react';
import { FieldTypes } from '../model/Fieldtypes';
import { Plugins } from '@capacitor/core';
import Note from '../model/Note';

const NoteDetails: React.FC<{
  notes: Note[],
  setNotes: Dispatch<SetStateAction<Note[]>>
}> = props => {
  const noteId = useParams<{noteId: string}>().noteId;
  const selectedNote = props.notes?.find(note => note.id.toString() === noteId)
  const [startedDeletingNote, setStartedDeletingNote] = useState(false);
  const history = useHistory();

  function handleUserInput(e: CustomEvent, fieldName: FieldTypes.BODY | FieldTypes.TITLE) {
    const newNoteArray = props.notes?.map(note => {
      if (note.id.toString() === noteId) {
        note[fieldName] = e.detail.value;
      }
      return note
    })
    props.setNotes(newNoteArray)
    Plugins.Storage.set({key: 'notes', value: JSON.stringify(newNoteArray)})
  }

  function deleteNote() {
    const newNoteArray: Note[] = [];
    props.notes.forEach(note => {
      if (note.id.toString() !== noteId) {
        newNoteArray.push(note);
      }
    });
    props.setNotes(newNoteArray);
    Plugins.Storage.set({key: 'notes', value: JSON.stringify(newNoteArray)});
  }
  
  return (
    <React.Fragment>
      <IonAlert 
        isOpen={startedDeletingNote} 
        header="Sicher?" 
        message="Die Notiz wird hierdurch entgültig gelöscht."
        buttons={[
          {
            text: "Nein",
            role: "cancel",
            handler: () => {
              setStartedDeletingNote(false)
            }
          },
          {
            text: "Ja",
            handler: () => {
              deleteNote()
              setStartedDeletingNote(false)
              history.push("/notes")
            }
          }
        ]}/>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{selectedNote?.title}</IonTitle>
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Notizdetails</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Titel</IonLabel>
              <IonInput type="text" value={selectedNote?.title} onIonChange={e => handleUserInput(e, FieldTypes.TITLE)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Details</IonLabel>
              <IonTextarea autoGrow={true} value={selectedNote?.body} onIonChange={e => handleUserInput(e, FieldTypes.BODY)}></IonTextarea>
            </IonItem>
            <IonItem>
              <IonButton onClick={() => setStartedDeletingNote(true)}>Notiz löschen</IonButton>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    </React.Fragment>
  )
}

export default React.memo(NoteDetails)