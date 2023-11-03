import { Component, OnInit } from '@angular/core';
import { faSun, faMoon } from '@fortawesome/free-regular-svg-icons'
import { faHouseUser, faAnchor } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faXTwitter, faTiktok, faInstagram, faGithub, } from '@fortawesome/free-brands-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';

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

  constructor(private dialog: MatDialog,
  ) { }

  ngOnInit(): void { }

  openSignInDialog() {
    this.dialog.open(UserDialogComponent, {
      data: { isSignIn: true }
    });
  }

  openSignUpDialog() {
    this.dialog.open(UserDialogComponent, {
      data: { isSignIn: false }
    });
  }
}
