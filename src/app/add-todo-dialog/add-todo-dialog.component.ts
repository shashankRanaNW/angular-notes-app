import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { Note,  } from 'src/note';
import { NOTES_LIST } from 'src/todo_list';
import { TodoServiceService } from '../todo-service.service';

@Component({
  selector: 'app-add-todo-dialog',
  templateUrl: './add-todo-dialog.component.html',
  styleUrls: ['./add-todo-dialog.component.css']
})
export class AddTodosDialogComponent {

  note : Note = {id : 0, title: "", note : ""}

  // db = getFirestore();
  // auth = getAuth();
  // uid = this.auth.currentUser?.uid;

  constructor(public dialogRef: MatDialogRef<AddTodosDialogComponent>, 
    private _snackbar : MatSnackBar,
    private formBuilder : FormBuilder,
    public noteService: TodoServiceService){}

  myForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    note: ['', [Validators.required] ],
  });

  async onSave(){
    this.noteService.addNote(this.note);
    this.dialogRef.close();
  }
}