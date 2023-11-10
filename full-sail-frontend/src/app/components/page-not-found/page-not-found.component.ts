import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  isSignedIn: boolean = false;

  constructor(private router: Router, private auth: Auth) { }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
    });
  }


  returnToLandingPage() {
    this.router.navigate(['home']);
  }

}
