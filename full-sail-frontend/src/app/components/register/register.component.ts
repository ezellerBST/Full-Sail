import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
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



  constructor(
    private userService: UserService,
    public router: Router,
    private auth: Auth,
    public dialogRef: MatDialogRef<RegisterComponent>,
  ) { }

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
        this.dialogRef.close();
      })
      .catch((error) => {
  console.log(error);
});
  }

}
