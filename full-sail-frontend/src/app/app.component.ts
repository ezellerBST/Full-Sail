import { Component, OnInit } from '@angular/core';
import { faSun, faMoon } from '@fortawesome/free-regular-svg-icons'
import { faHouseUser, faAnchor } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faXTwitter, faTiktok, faInstagram, faGithub, } from '@fortawesome/free-brands-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  faFacebook = faFacebook;
  faTwitter = faXTwitter;
  faTiktok = faTiktok;
  faInstagram = faInstagram;
  faGithub = faGithub;
  faHouseUser = faHouseUser;
  faMoon = faMoon;
  faSun = faSun;
  faAnchor = faAnchor;

  title = 'full-sail-frontend';

  email: string = '';
  password: string = '';
  displayName: string = '';
  photoURL: string = '';
  phoneNum: string = '';
  isSignedIn: boolean = false;

  constructor(private dialog: MatDialog,
    private userService: UserService,
    public router: Router,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      // Update isSignedIn based on the user's authentication state
      this.isSignedIn = !!user; 
    });
  }

  openSignInDialog() {
    this.dialog.open(UserDialogComponent, {
      data: { isSignIn: true }
    });
  }

  // openSignUpDialog(email: string, password: string, displayName: string, photoURL: string) {
  //   this.dialog.open(UserDialogComponent, {
  //     data: { isSignIn: false }
  //   });
  //   this.userService.createUserWithEmailAndPassword(email, password, displayName, photoURL);
  // }

  submitForm() {
    this.userService.createUser(this.email, this.password, this.displayName, this.photoURL, this.phoneNum)
      .then((user) => {
        this.router.navigate(['account']);
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
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
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  signOut() {
    return signOut(this.auth).then(() => {
      console.log('User signed out');
      this.router.navigate(['home']);
    }).catch((error) => {
      console.log(error);
      return Promise.reject(error);
    });
  }

  getProfile(){
    this.router.navigate(['profile']);
  }
}
