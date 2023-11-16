import { Injectable } from '@angular/core';
import { Firestore, addDoc, doc, setDoc, getDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Auth } from '@angular/fire/auth';
import { Transaction } from '../models/transaction';
import { AddTransactionComponent } from '../components/add-transaction/add-transaction.component';
import { EditTransactionComponent } from '../components/edit-transaction/edit-transaction.component';
import { DeleteTransactionComponent } from '../components/delete-transaction/delete-transaction.component';
import { Papa } from 'ngx-papaparse';
import { MatTableDataSource } from '@angular/material/table';
import { Goal } from '../models/goal';


@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(
    private papa: Papa,
    private auth: Auth,
    private router: Router,
    public dialog: MatDialog,
  ) { }








  openTransactionDialog() {
    this.dialog.open(AddTransactionComponent, {
    width: '33%',
    height: '20%',
    })
  }

  openEditTransactionDialog() {
    this.dialog.open(EditTransactionComponent, {
      width: '33%',
      height: '20%'
    })
  }

  openDeleteTransactionDialog() {
    this.dialog.open(DeleteTransactionComponent, {
      width: '20%',
      height: '20%'
    })
  }

  editTransactionButton() {

  }

  deleteTransactionButton() {
    
  }

}
