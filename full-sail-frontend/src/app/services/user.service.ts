import { Injectable } from '@angular/core';
// import { User } from '../models/user';
import { Firestore, addDoc, setDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, UserCredential, updateProfile, updatePhoneNumber } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(public firestore: Firestore, public auth: Auth, public router: Router, public dialog: MatDialog) { }

  // createUserWithEmailAndPassword(email, password, displayName, photoURL, phoneNum) {
  //   return createUserWithEmailAndPassword(this.auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       if (user) {
  //         return updateProfile(user, {
  //           displayName: displayName,
  //           photoURL: photoURL,
  //         }).then(() => user);
  //       }
  //       console.log(user);
  //       // sendEmailVerification(this.auth.currentUser);
  //       return null; // Handle case where user is not available
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null; // Handle the error scenario
  //     });
  // }

  createUser(email, password, displayName, photoURL, phoneNum) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return updateProfile(user, {
            displayName: displayName,
            photoURL: photoURL,
          })
          .then(() => {
            return updatePhoneNumber(user, phoneNum)
              .then(() => {
                console.log('Phone:', phoneNum)
                // return user;
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        }
        console.log(user);
        return null
      })
      .catch((error) => {
        console.log(error);
        return null
      });
  }
  

  signInWithEmailAndPassword(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateUserProfileWithAddress(address) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // Store the address in Firestore
        const db = collection(this.firestore, 'userAddress');
        addDoc(db, address)
          .then(() => {
            console.log('Address updated:', address)
          })
          .catch((error) => {
            console.error('Error in Firestore: ', error);
          });
      }
    })
  }
}


