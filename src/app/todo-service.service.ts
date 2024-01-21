import { Injectable } from '@angular/core';
import { Auth, User, getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { getFirestore, getDocs, collection, Firestore, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Note, noteConverter,  } from 'src/note';
import { environment } from './environments/environment';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { BehaviorSubject } from 'rxjs';
import { NOTES_LIST } from 'src/todo_list';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoServiceService {

  constructor( private http: HttpClient ) {
    //first get the original NOTES_LIST
    this.notesSubject.next( NOTES_LIST);
  }

  //ngOnInit doesn't work in services
  // ngOnInit(){
  //   this.db = getFirestore();
  //   this.auth = getAuth();
  // }

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private notesSubject: BehaviorSubject<Note[] | null> = new BehaviorSubject<Note[] | null>(null);

  setNotes(notes: Note[]) {
    this.notesSubject.next(notes);
  }

  getNotesObservable() {
    return this.notesSubject.asObservable();
  }

  //get the cached copy, for fetching the latest notes, use getNotes
  getNotesCurr(): Note[] | null {
    return this.notesSubject.getValue();
  }

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getUserObservable() {
    return this.userSubject.asObservable();
  }

  getEmailCurr(): string | undefined | null {
    return (this.userSubject.getValue())?.email;
  }

  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  auth = getAuth(this.app);

  async authWithEmail(email?: string, password?: string): Promise<string> {

    let errorMessage = "";
    this.db = getFirestore();
    this.auth = getAuth();
    if (email != undefined && password != undefined) {
      if (this.db == undefined || this.auth == undefined) {
        console.log("Firebase not initialized");
        errorMessage = "Firebase not initialized";
      }
      else {
        await signInWithEmailAndPassword(this.auth, email, password)
          .then((userCredential) => {
            // Signed in 
            let user = userCredential.user;
            console.log(`Service: User is${userCredential.user.email}`);
            this.setUser(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            errorMessage = error.message;
            console.log(errorMessage);
          });
      }
    }
    return errorMessage;
  }

  //if no error then empty string, else error message
  async addNote(note: Note): Promise<string> {
    // this.db = getFirestore();
    // this.auth = getAuth();
    // let error_mess = "";
    // if (this.db == undefined || this.auth == undefined) {
    //   console.log("Firebase not initialized");
    // }
    // else if (this.userSubject.getValue() == null) {
    //   console.log("User not logged in");
    // }
    // else {
    //   const uid = this.userSubject.getValue()!.uid;
    //   const path = `users/${uid}/notes/${note.id}`;
    //   const cNoteRef = doc(this.db, path).withConverter(noteConverter);
    //   await setDoc(cNoteRef, note).then(() => {
    //     this.getNotes();
    //   }).catch(
    //     (error) => {
    //       error_mess = error;
    //       return error;
    //     }
    //   );
    // }
    // return error_mess;
    let error_mess = "No error, all is well";
    await this.getNotes().then(
      (notes :  Note[]|null) =>{
        if( notes == null){
          this.notesSubject.next( [note] );
        }
        else{
          notes.push(note)
          this.notesSubject.next( notes );
        }
        
      },
      ( reason : any)=>{
        console.log( reason);
        error_mess = "error";
      }
    )
      return error_mess;
  }

  async getNotes(): Promise<Note[]|null> {
    // this.db = getFirestore();
    // this.auth = getAuth();
    // if (this.userSubject.getValue() != null) {
    //   const uid = this.userSubject.getValue()!.uid;
    //   let notes: Note[] = [];
    //   const querySnapshot = await getDocs(collection(this.db, "users", uid, "notes"));
    //   querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     const note = doc.data() as Note;
    //     notes.push(note);
    //   });
    //   notes = notes.sort((note1, note2) => {
    //     return note1.id! <= note2.id! ? -1 : 1;
    //   });
    //   this.notesSubject.next(notes);
    //   return notes;
    // }
    // else {
    //   return [];
    // }
    return this.notesSubject.getValue();
  }

  async

  async updateNote(note: Note) {
    // this.db = getFirestore();
    // this.auth = getAuth();
    // const noteRef = doc(this.db, "users", this.userSubject.getValue()!.uid, "notes", note.id!.toString());
    // await updateDoc(noteRef, {
    //   title: note.title!,
    //   note: note.note!,
    // });
    // this.getNotes();
    let curr_notes = this.getNotes();
    curr_notes.then( (notes)=>{
      if( notes == null){
        return;
      }
      for( let i = 0; i < notes.length; i++){
        if( notes[i].id == note.id ){
          notes[i] = note;
          this.setNotes( notes);
          return;
        }
      }
    })
    
  }

  async deleteNote(id: number) {
    // this.db = getFirestore();
    // this.auth = getAuth();
    // const noteRef = doc(this.db, "users", this.userSubject.getValue()!.uid, "notes", id!.toString());
    // await deleteDoc(noteRef);
    // this.getNotes();
    let curr_notes = this.getNotes();
    curr_notes.then( (notes)=>{
      if( notes == null){
        return;
      }
      for( let i = 0; i < notes.length; i++){
        if( notes[i].id == id ){
          notes.splice(i,1);
          this.setNotes( notes);
          return;
        }
      }
    })
    
  }

  async signOut() {
    this.db = getFirestore();
    this.auth = getAuth();
    this.auth.signOut();
    this.userSubject.next(null);
    this.notesSubject.next(null);
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }

  async resetPassword(old_pass: string, new_pass: string) {
    this.auth = getAuth();
    await signInWithEmailAndPassword(this.auth, this.auth.currentUser?.email!, old_pass).catch((error) => {
      throw error;
    })
    updatePassword(this.auth.currentUser!, new_pass).then(
      () => {
      }
    ).catch((error) => {
      throw error;
    });
  }
}
