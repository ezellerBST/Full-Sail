import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FinanceService } from 'src/app/services/finance.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  isSignedIn: boolean = false;
  date: Date;
  description: string;
  amount: number;
  contributeToGoals: boolean = false;

  constructor(
    private auth: Auth,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<AddTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      date: Date, 
      description: string, 
      amount: number, 
      contributeTogoals: boolean 
    },
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
      this.date = this.date;
      this.description = this.description;
      this.amount = this.amount;
      this.contributeToGoals = this.contributeToGoals;
    });
  }

  async addTransaction() {
    await this.financeService.inputTransactionFromParameter({
      date: this.date,
      description: this.description,
      amount: this.amount,
      contributeToGoals: this.contributeToGoals
    })
    console.log({ date: this.date, description: this.description, amount: this.amount });
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
