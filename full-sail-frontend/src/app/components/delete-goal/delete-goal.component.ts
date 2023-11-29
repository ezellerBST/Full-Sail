import { Component, OnInit, Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinanceService } from 'src/app/services/finance.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-delete-goal',
  templateUrl: './delete-goal.component.html',
  styleUrls: ['./delete-goal.component.css']
})
export class DeleteGoalComponent implements OnInit {

  isSignedIn: boolean = false;
  goalId: string;

  constructor(
    private auth: Auth,
    private sharedService: SharedService,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<DeleteGoalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { goalId }
  ) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
      this.goalId = this.data.goalId;
    })
  }


  async deleteGoalById() {
    await this.financeService.deleteGoalButton(this.goalId);
    console.log('Goal ID is: ', this.goalId);
    await this.sharedService.accountGoalUpdate();
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
