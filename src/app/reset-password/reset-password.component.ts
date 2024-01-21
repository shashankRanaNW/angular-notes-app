import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoServiceService } from '../todo-service.service';
import { noteConverter } from 'src/note';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  constructor(private formBuilder : FormBuilder,
    private _snackbar : MatSnackBar,
    public todoService : TodoServiceService){    
    }

  myForm: FormGroup = this.formBuilder.group({
    old_pass: ['', Validators.required, Validators.minLength(3)],
    new_pass: ['', [Validators.required, Validators.minLength(3)]],
  });

  async onSubmit(){
    const formValues = this.myForm.value;
    let old_pass = formValues.old_pass;
    let new_pass = formValues.new_pass;
    await this.todoService.resetPassword(old_pass, new_pass).catch( (error)=>{
      this._snackbar.open(error,"ok",{duration : 2000});
    })
  }
  
}
