import { Injectable } from '@angular/core';

import { Firestore, addDoc, doc, setDoc, getDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Auth } from '@angular/fire/auth';
import { AddTransactionComponent } from '../components/add-transaction/add-transaction.component';


@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(
    private auth: Auth,
    private router: Router,
    public dialog: MatDialog,
  ) { }












}
