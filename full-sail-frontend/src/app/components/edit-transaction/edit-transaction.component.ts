import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.css']
})
export class EditTransactionComponent implements OnInit {

  isSignedIn: boolean = false;
  date: Date = new Date;
  description: string;
  amount: number;



  constructor(
    private auth: Auth,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<EditTransactionComponent>
  ) { }

    ngOnInit(): void {
        this.auth.onAuthStateChanged(user => {
          this.isSignedIn = !!user;
        });
    }

    //NEED TO CHANGE.app() TO ACTUAL NAME OF FUNCTION IN SERVICE
    
    // editTransaction() {
    //   this.financeService.app(this.date, this.description, this.amount )
    //   .then((transaction) => {
    //     console.log('Transaction was successfully updated: ', transaction);
    //     this.dialogRef.close();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // }

    closeDialog() {
      this.dialogRef.close();
    }
}
