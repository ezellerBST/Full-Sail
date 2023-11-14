import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FinanceService } from 'src/app/services/finance.service';


@Component({
  selector: 'app-delete-transaction',
  templateUrl: './delete-transaction.component.html',
  styleUrls: ['./delete-transaction.component.css']
})
export class DeleteTransactionComponent implements OnInit {

  isSignedIn: boolean = false;
  transactionId: string;

  constructor(
    private auth: Auth,
    private router: Router,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<DeleteTransactionComponent>
  ) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
    });
  }

  //NEED TO UPDATE .deleteTransaction TO ACTUAL NAME OF FUNCTION IN SERVICE
  
  // deleteTransaction() {
  //   this.financeService.deleteTransaction(this.transactionId)
  //   .then((transaction) => {
  //     console.log('Deleted transaction: ', transaction);
  //     this.dialogRef.close();
  //   });
  // }

  closeDialog(){
    this.dialogRef.close();
  }


}
