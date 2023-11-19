import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from 'src/app/services/shared.service';

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

  constructor(private auth: Auth, private userService: UserService, private sharedService: SharedService) 
  { 
    this.sharedService.transactionsUpdated.subscribe(() => {
      this.getUserDetails();
    });
  }

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
        const userDoc = await this.userService.getUserProfileDocument(this.user.uid);
        this.address = userDoc.address;
        this.phoneNum = userDoc.phoneNumber;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProfile() {
    try {
      await this.userService.updateUserProfile(this.displayName, this.photoURL, this.email, this.address, this.phoneNum);
      await this.sharedService.profileCardUpdate(); // Refresh user details after update
    } catch (error) {
      console.log(error);
    }
  }









}

  // getErrorMessage() {
  //   if (this.emailCheck.hasError('required')) {
  //     return 'You must enter a valid email';
  //   }
  //   return this.emailCheck.hasError('email') ? 'Not a valid email' : 'Please enter a valid email';
  // }
