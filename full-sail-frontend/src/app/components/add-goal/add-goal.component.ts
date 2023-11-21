import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FinanceService } from 'src/app/services/finance.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.css']
})
export class AddGoalComponent implements OnInit {

  isSignedIn: boolean = false;
  name: string;
  amountPerPaycheck: number = 0;
  total: number = 0;

  constructor(
    private auth: Auth,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<AddGoalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: string,
      amountPerPaycheck: number,
      total: number
    },
    private sharedService: SharedService
  ) { }


  ngOnInit(): void {
      this.auth.onAuthStateChanged( user => {
        this.isSignedIn = !!user;
        this.name = this.name;
        this.amountPerPaycheck = this.amountPerPaycheck;
        this.total = this.total;
      }),
      this.financeService.getGoals()
  }

  async addGoal(){
    await this.financeService.createGoal(
      this.name,
      this.amountPerPaycheck,
      this.total
    );
   console.log(this.name, this.amountPerPaycheck, this.total);
   await this.financeService.getGoals();
   await this.sharedService.accountGoalUpdate();
   this.dialogRef.close(); 
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
