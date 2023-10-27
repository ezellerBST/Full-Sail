import { Component, OnInit } from '@angular/core';
import { UserDialogComponent } from '../components/user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dialog: MatDialog, public userService: UserService
    ) {}
  
  ngOnInit(): void {}

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

