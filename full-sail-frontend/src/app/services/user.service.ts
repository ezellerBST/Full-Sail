import { Injectable } from '@angular/core';
// import { User } from '../models/user';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { getAuth, Auth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification, UserCredential, updateProfile, User, updatePhoneNumber } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private firestore: Firestore, private auth: Auth, public router: Router, public dialog: MatDialog) { this.auth = getAuth() }

  // Function to create a user using email and password
  async createUserWithEmailAndPassword(email, password, displayName, photoURL): Promise<User> {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user
      if (user) {
        updateProfile(user, {
          displayName,
          photoURL,
        });
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

//   // Sign in with email/password
//   SignIn(email: string, password: string) {
//     return this.afAuth
//       .signInWithEmailAndPassword(email, password)
//       .then((result) => {
//         this.SetUserData(result.user);
//         this.afAuth.authState.subscribe((user) => {
//           if (user) {
//             // Open the dialog component
//             const dialogRef = this.dialog.open(UserDialogComponent, {
//               width: '300px',
//               data: { user: user }
//             });

//             // After the dialog is closed, navigate to the 'account' page
//             dialogRef.afterClosed().subscribe(() => {
//               this.router.navigate(['account']);
//             });
//           }
//         });
//       })
//       .catch((error) => {
//         window.alert(error.message);
//       });
//   }

//   // Send email verification when new user signs up
//   SendVerificationMail() {
//     return this.afAuth.currentUser
//       .then((user: any) => user.sendEmailVerification())
//       .then(() => {
//         this.router.navigate(['account']);
//       });
//   }

//   // Sign-in with Google
//   GoogleAuth () {
//     this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
//     this.router.navigate(['account']);
//   }

//   // Sign out
//   SignOut() {
//     return this.afAuth.signOut().then(() => {
//       localStorage.removeItem('user');
//       this.router.navigate(['home']);
//     });
//   }

