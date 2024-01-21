import { Component } from '@angular/core';
import { User } from '../user';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Router } from '@angular/router';

import { doc, getFirestore, setDoc } from "firebase/firestore";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  db = getFirestore();
  
  constructor(private router: Router, private _snackBar: MatSnackBar){
    console.log(`DB is : ${ JSON.stringify(this.db.toJSON) } `);
  }
  user  = new User();
  submitted = false;

  async onSubmit(){
    const auth = getAuth();
    if( this.user.email != undefined && this.user.password !=undefined){
      createUserWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then(async (userCredential) => {
          const user_auth = userCredential.user
          const uid = user_auth.uid;
          console.log(`user email signed up ${user_auth.email}`)

          // Add a new document in collection "cities"
          await setDoc(doc(this.db, "users", uid ), {
            uid : uid,
            name: this.user.name,
            email: this.user.email,
            password: this.user.password,
            phone_no: this.user.password
          }).catch( (error)=>{ this._snackBar.open(error,"F Bhai F") } );
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this._snackBar.open(errorMessage, "F bhai F");
          // ..
        });
    }
  }

}
