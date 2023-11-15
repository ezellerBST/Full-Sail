import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  isSignedIn: boolean = false;



  constructor(
    private userService: UserService,
    public router: Router,
    private auth: Auth,
    public dialogRef: MatDialogRef<SigninComponent>,
  ) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      // Update isSignedIn based on the user's authentication state
      this.isSignedIn = !!user;
    });
  }

  signInForm() {
    this.userService.signInWithEmailAndPassword(this.email, this.password)
      .then((user) => {
        if (!user) {
          return null;
        } else {
          this.router.navigate(['account']);

          console.log(user);
        }
        this.dialogRef.close();
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }


}
