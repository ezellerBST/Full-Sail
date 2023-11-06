import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  displayName: string = "";
  email: string = "";
  emailCheck = new FormControl('', [Validators.required, Validators.email]);
  photoURL: string = "";
  address: string = "";
  phoneNum: string = "";

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  async getUserDetails() {
    try {
      const userCredential = await this.auth.currentUser;
      if (userCredential) {
        this.user = userCredential;
        this.displayName = this.user.displayName;
        this.email = this.user.email;
        this.photoURL = this.user.photoURL;
        this.phoneNum = this.user.phoneNum;
        this.address = this.user.address;
      }
    } catch (error) {
      console.log(error);
    }
  }

  getErrorMessage() {
    if(this.emailCheck.hasError('required')){
      return 'You must enter a valid email';
    }
    return this.emailCheck.hasError('email') ? 'Not a valid email' : 'Please enter a valid email';
  }

}
