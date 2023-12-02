import { Component, HostListener, OnInit } from '@angular/core';
import { faSun, faMoon } from '@fortawesome/free-regular-svg-icons'
import { faHouseUser, faAnchor } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faXTwitter, faTiktok, faInstagram, faGithub,} from '@fortawesome/free-brands-svg-icons';
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
  // faMenu = faMenu;

  title = 'full-sail-frontend';

  email: string = '';
  password: string = '';
  displayName: string = '';
  photoURL: string = '';
  phoneNum: string = '';
  isSignedIn: boolean = false;
  smallScreenSize = window.innerWidth <= 1200;P

  constructor(
    private userService: UserService,
    public router: Router,
    private auth: Auth
  ) { }


  //Checks to see if the user is signed in when they visit the website
  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
      if (!user) {
        this.router.navigate(['home']);
      }
    });
    // if (window.screen.width >= 1200) {
    //   this.smallScreenSize = false;
    // }
    // if (window.screen.width <= 1200) {
    //   this.smallScreenSize = true;
    // }

    this.setDarkLightMode();

    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
      this.setDarkLightMode();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.smallScreenSize = window.innerWidth <= 1200;
  }

  //Opens the dialog popup to sign in to the app for the registered user
  openSignInDialog() {
    this.userService.openSignInDialog();
  }

  //Opens up the register dialog to allow for a new user to create an account
  openRegisterDialog() {
    this.userService.openRegisterDialog();
  }

  //Signs out the logged in user from their session, revoking the token
  signOut() {
    return signOut(this.auth).then(() => {
      console.log('User signed out');
      this.router.navigate(['home']);
    }).catch((error) => {
      console.log(error);
      return Promise.reject(error);
    });
  }

  //If the user is already signed in, allows them to go to their profile page
  getProfile() {
    this.router.navigate(['profile']);
  }

  //Allows a logged in user to go to their accounts page showing their financial info
  getAccountsPage() {
    this.router.navigate(['account']);
  }

  getHomePage() {
    this.router.navigate(['home']);
  }


  setDarkLightMode() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentMode = document.body.classList.contains('dark-mode');

    if (!!prefersDarkMode && !currentMode || !prefersDarkMode && currentMode) {
      document.body.classList.toggle('dark-mode');
    }
  }
}
