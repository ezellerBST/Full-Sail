import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email: string = '';
  password: string = '';
  displayName: string = '';
  photoURL: string = '';
  phoneNum: string = '';
  isSignedIn: boolean = false;



  constructor( private dialog: MatDialog, private userService: UserService, public router: Router, private auth: Auth) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      // Update isSignedIn based on the user's authentication state
      this.isSignedIn = !!user; 
    });
  }

  submitForm() {
    this.userService.createUser(this.email, this.password, this.displayName, this.photoURL)
      .then((user) => {
        this.router.navigate(['account']);
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
