import { Injectable } from '@angular/core';
import { Firestore, addDoc, doc, setDoc, getDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Auth } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class FinanceServiceService {

  constructor(
    private auth: Auth,
    public firestore: Firestore,
    public router: Router,
    public dialog: MatDialog
  ) { }
























}
