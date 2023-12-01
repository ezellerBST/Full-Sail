import { Component, OnInit, Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinanceService } from 'src/app/services/finance.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-delete-transaction',
  templateUrl: './delete-transaction.component.html',
  styleUrls: ['./delete-transaction.component.css']
})
export class DeleteTransactionComponent implements OnInit {

  isSignedIn: boolean = false;
  id: string;

  constructor(
    private auth: Auth,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<DeleteTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transactionId },
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
      this.id = this.data.transactionId;
    });
  }

  async deleteTransaction() {
    await this.financeService.deleteTransactionButton(this.id);
    console.log(this.id);
    await this.sharedService.accountTransactionsUpdate();
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
