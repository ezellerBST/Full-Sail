import { Injectable, NgZone } from '@angular/core';
import { User } from '../models/user';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../components/user-dialog/user-dialog.component';
import * as auth from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  userData: User = new User();

  constructor(private firestore: Firestore, private afAuth: AngularFireAuth, public router: Router, public ngZone: NgZone, public dialog: MatDialog) {

    // Saving user data in localstorage when logged in and setting up null when logged out

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });

  }

  // Set up User Data on Sign-up
  SetUserData(user: any) {
    const userRef = doc(this.firestore, 'users', user.uid);
    const userData: User = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNum: user.phoneNum,
      profilePic: user.profilePic,
    };
    return setDoc(userRef, userData, { merge: true });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            // Open the dialog component
            const dialogRef = this.dialog.open(UserDialogComponent, {
              width: '300px',
              data: { user: user }
            });

            // After the dialog is closed, navigate to the 'account' page
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['account']);
            });
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.SendVerificationMail();
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            // Open the dialog component
            const dialogRef = this.dialog.open(UserDialogComponent, {
              width: '300px',
              data: { user: user }
            });

            // After the dialog is closed, navigate to the 'account' page
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['account']);
            });
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verification when new user signs up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((user: any) => user.sendEmailVerification())
      .then(() => {
        this.router.navigate(['account']);
      });
  }

  // Sign-in with Google
  GoogleAuth () {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
    this.router.navigate(['account']);
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['home']);
    });
  }

}
