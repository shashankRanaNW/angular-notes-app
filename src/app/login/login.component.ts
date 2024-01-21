import { Component, inject } from '@angular/core';
import { User } from '../user';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TodoServiceService } from '../todo-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  rememberMe = false;

  constructor(private router: Router, 
    private _snackBar: MatSnackBar,
    public todoService: TodoServiceService){}
  
  durationInSeconds = 100;

  openSnackBar(message : string) {
    this._snackBar.open( message, "Ok", {duration:2000});
  }

  async onSubmit(){
    await this.todoService.authWithEmail( this.user.email, this.user.password).then( (str)=>{
      if( str.length == 0 ){
        this.router.navigate(["\home"]);
        if (this.rememberMe) {
          // Store the username and password in localStorage
          localStorage.setItem('username', this.user.email!);
          localStorage.setItem('password', this.user.password!);
        } else {
          // Clear the stored username and password from localStorage
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
      }
      else{
        this._snackBar.open(str,"Ok",{duration:2000});
      }
    });
  }

  user  = new User();
}
