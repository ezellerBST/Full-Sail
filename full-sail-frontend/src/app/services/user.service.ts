import { Injectable } from '@angular/core';
// import { User } from '../models/user';
import { Firestore, addDoc, doc, setDoc, getDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, UserCredential, updateProfile, updateEmail } from '@angular/fire/auth';
import { SigninComponent } from '../components/signin/signin.component';
import { RegisterComponent } from '../components/register/register.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    public firestore: Firestore,
    private auth: Auth,
    public router: Router,
    public dialog: MatDialog
  ) { }

  //Function that allows a new user to be added to the Firestore
  createUser(email, password, displayName, photoURL) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return updateProfile(user, {
            displayName: displayName,
            photoURL: photoURL,
          }).then(() => user);
        }
        console.log(user);
        // sendEmailVerification(this.auth.currentUser);
        return null; // Handle case where user is not available
      })
      .catch((error) => {
        console.log(error);
        return null; // Handle the error scenario
      });
  }

  //Allows user to sign in with password and email
  signInWithEmailAndPassword(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        return user;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Call to get the current user's document that stores all their info
  async getUserProfileDocument(userId) {
    const profileCollection = collection(this.firestore, 'profile');
    const userDoc = doc(profileCollection, userId);

    try {
      const docSnapshot = await getDoc(userDoc);
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      } else {
        console.log("User doc does not exist");
        return null; // Handle non-existing document
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  //Allows the user to update his profile document in Firestore so it is 
  //reflected in thier profile page and collection
  updateUserProfile(displayName, photoURL, email, address, phoneNum) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        return updateProfile(user, {
          displayName: displayName,
          photoURL: photoURL,
        })
          .then(() => {
            // After updating the profile, update the address and phone number in Firestore
            const profileCollection = collection(this.firestore, 'profile');
            const userDoc = doc(profileCollection, user.uid);

            const data = { address: address, phoneNumber: phoneNum };

            setDoc(userDoc, data, { merge: true })
              .then(() => {
                console.log('Updated address and phone number:', data);
              })
              .catch((error) => {
                console.error('Error updating Firestore:', error);
              });

            // Check and update email if needed
            if (email && email !== user.email) {
              return updateEmail(user, email)
                .then(() => {
                  console.log('New email:', email);
                })
                .catch((error) => {
                  console.error('Error updating email:', error);
                });
            }

            console.log('Profile updated:', user);
            return null;
          })
          .catch((error) => {
            console.error('Error updating profile:', error);
          });
      }
      return null;
    });
  }

  //Function that calls the SignInComponent to sign in the user as a popup window
  openSignInDialog() {
    this.dialog.open(SigninComponent, {
      width: '600px',
      height: '300px',
    });
  }

  //Function that calls the RegisterComponent to register a new user as a popup window
  openRegisterDialog() {
    this.dialog.open(RegisterComponent, {
      width: '600px',
      height: '300px',
    });
  }



}


