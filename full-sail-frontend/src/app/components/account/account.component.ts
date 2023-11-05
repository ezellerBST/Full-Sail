import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  
  user: any;
  displayName: string = "";

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
      }
    } catch (error) {
      console.log(error);
    }
  }
  
}
