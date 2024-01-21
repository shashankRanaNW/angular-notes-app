import { Component, Inject, inject } from '@angular/core';

import {
  MatBottomSheet,
  MatBottomSheetRef,
  MatBottomSheetConfig,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';
import { Note,  } from 'src/note';
import { _isNumberValue } from '@angular/cdk/coercion';
import { MatDialog } from '@angular/material/dialog';
import { AddTodosDialogComponent } from '../add-todo-dialog/add-todo-dialog.component';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { timestamp } from 'rxjs';
import { TodoServiceService } from '../todo-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NOTES_LIST } from 'src/todo_list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  constructor(private _bottomSheet: MatBottomSheet, 
    public dialog: MatDialog, 
    private _snackbar : MatSnackBar,
    public noteService: TodoServiceService) { }

  //apply service to get list
  notes: Note[] = [];
  logged_in = false;
  email : string|null = "";

  async ngOnInit(){

    console.log("ngOnInit of home.component called");

    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    if( username && password ){
      await this.noteService.authWithEmail( username, password);
    }

    //TODO: PLUG API HERE

    this.noteService.getNotesObservable().subscribe(notes => {
      // Update the user's email
      if( notes != null){
        this.notes = notes;
      }
      else{
        this.notes = NOTES_LIST;
      }
    });

    this.noteService.getUserObservable().subscribe(user => {
      // Update the user's email
      if( user == undefined){
        this.email = null;
      }
      else{
        this.email = user?.email;
      }
      
      if(user != null){
        this.logged_in = true;
      }
      else{
        this.logged_in = false;
        this._snackbar.open("Please sign in","Ok", {
          duration: 3000
        });
        this.logged_in = false
      }
    });
    if( this.email != null){
      console.log(`Home: got the email ${this.email}`);
      this._snackbar.open(`Welcome ${this.email}`,undefined, {
        duration: 3000
      });
      this.logged_in = true;
    }
    else{
      this._snackbar.open("Please sign in","Ok", {
        duration: 3000
      });
      this.logged_in = false;
    }
  }

  public hoveredRowIndex: number | null = null;  

  openBottomSheet(id?: number): void {
    const config: MatBottomSheetConfig = {
      data: { id: id } // Pass the id value using the `data` property
    };
    this._bottomSheet.open(BottomSheetOverviewExampleSheet, config);
  }

  onDelete(id?: number): void {
    if (id && id >= 1 && id <= this.notes.length) {
      this.noteService.deleteNote(id); 
      // Make API Call here
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddTodosDialogComponent, {
      width: '80%',
      maxWidth: "800px"
    });
    dialogRef.afterClosed().subscribe(result => {
      this.noteService.getNotes();
    });
  }

  addNote() {
    console.log("addNote called");
    this.openDialog();
  }

}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: './bottom-sheet-edit.html',
  styleUrls: ['./home.component.css'],
})
export class BottomSheetOverviewExampleSheet {
  id?: number;
  note: Note = { id: 1, title: 'Answer PSD show cause notice', note: '2023-06-28'};

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: any, // Inject the MAT_BOTTOM_SHEET_DATA token
    public noteService: TodoServiceService
  ) 
  {
    if (data && data.id) {
      noteService.getNotes().then(
        (notes)=>{
          this.id = data.id; // Assign the passed id value to the id variable
          this.note = notes![data.id!-1];
        },
        (reason)=>{
          console.log( "can't get note", reason);
        }
      )
    }
  }

  onSave() {
    this.noteService.updateNote(this.note);
    this._bottomSheetRef.dismiss();
  }

  onDelete() {
    this.noteService.deleteNote(this.id!);
    this._bottomSheetRef.dismiss();
  }

}
