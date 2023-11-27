import { Component, OnInit, Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinanceService } from 'src/app/services/finance.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-edit-goal',
  templateUrl: './edit-goal.component.html',
  styleUrls: ['./edit-goal.component.css']
})
export class EditGoalComponent implements OnInit {

  isSignedIn: boolean = false;
  date: Date;
  nameOfGoal: string
  amountPerPaycheck: number = 0;
  total: number = 0;
  balance: number = 0;
  goalId: string;


  constructor(
    private auth: Auth,
    private financeService: FinanceService,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<EditGoalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { goalId, date, nameOfGoal, amountPerPaycheck, total, balance }
  ) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
      this.goalId = this.data.goalId;
      this.nameOfGoal = this.data.nameOfGoal;
      this.date = this.data.date;
      this.amountPerPaycheck = this.data.amountPerPaycheck;
      this.total = this.data.total;
      this.balance = this.data.balance;
    })
  }

  async editGoal() {
    await this.financeService.editGoalButton(this.goalId, {  dateCreated: this.date, name: this.nameOfGoal, amountPerPaycheck: this.amountPerPaycheck, total: this.total, balance: this.balance })
    console.log("Goal: ", this.goalId, {  dateCreated: this.date, name: this.nameOfGoal, amountPerPaycheck: this.amountPerPaycheck, total: this.total, balance: this.balance });
    await this.sharedService.accountGoalUpdate();
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
