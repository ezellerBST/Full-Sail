import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FinanceService } from 'src/app/services/finance.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  isSignedIn: boolean = false;
  date: Date = new Date();
  description: string;
  amount: number;



  constructor(
    private router: Router,
    private auth: Auth,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<AddTransactionComponent>,

  ) { }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
    });
  }

  //NEED TO UPDATE .app TO ACTUAL NAME OF FUNCTION IN SERVICE

  // submitTransaction(){
  //   this.financeService.app(this.date, this.description, this.amount)
  //   .then((transaction) => {
  //     console.log(transaction);
  //     this.dialogRef.close();
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }

}
