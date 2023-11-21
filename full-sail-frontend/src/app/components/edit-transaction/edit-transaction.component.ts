import { Component, OnInit, Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FinanceService } from 'src/app/services/finance.service';
import { SharedService } from 'src/app/services/shared.service';

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
  id: string;



  constructor(
    private auth: Auth,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<EditTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transactionId, date, description, amount },
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
      this.id = this.data.transactionId;
      this.date = this.data.date;
      this.description = this.data.description;
      this.amount = this.data.amount;
    });
  }


  async editTransaction() {
    await this.financeService.editTransactionButton(this.id, this.date, this.description, this.amount)
    console.log(this.id, this.date, this.description, this.amount);
    await this.sharedService.accountTransactionsUpdate();
    this.dialogRef.close();

    // .then((transaction) => {
    //   console.log('Transaction was successfully updated: ', transaction);
    //   this.dialogRef.close();
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
