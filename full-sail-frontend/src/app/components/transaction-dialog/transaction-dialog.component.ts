import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.css']
})
export class TransactionDialogComponent {

  date: string;
  description: string;
  amount: number;
  isSignedIn: boolean = false;

  constructor(private userService: UserService,
    public router: Router,
    private auth: Auth,
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
  ) { }


  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
    });
  }

  submitTransaction() {
    //this.userService.
  }
























}
