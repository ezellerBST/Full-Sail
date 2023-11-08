import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, doc, setDoc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface TransactionTable {
  date: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit {

  user: any;
  displayName: string = "";
  dataSource = new MatTableDataSource<TransactionTable>();
  displayedColumns: string[] = ['date', 'description', 'amount'];


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private auth: Auth, private firestore: Firestore) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.getTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async getUserDetails() {
    try {
      const userCredential = await this.auth.currentUser;
      if (userCredential) {
        this.user = userCredential;
        this.displayName = this.user.displayName;
      }
    } catch (error) {
      console.log(error);
    }
  }

  addTransactions() {
    // Assume you have an array of transactions
    const sampleTransactions = [
      {
        date: '2023-11-01',
        description: 'Salary',
        amount: 5000
      },
      {
        date: '2023-11-02',
        description: 'Groceries',
        amount: -250
      }
    ];

    // Iterating through the sample transactions and adding them to Firestore
    sampleTransactions.forEach(async transaction => {
      try {
        const docRef = await addDoc(collection(this.firestore, 'transactions'), {
          date: transaction.date,
          description: transaction.description,
          amount: transaction.amount
        });

        // Fetch the transaction data after the document is added
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          console.log('Transaction data:', docSnapshot.data());
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    });

    this.getTransactions();
  }

  async getTransactions() {
    const querySnapshot = await getDocs(collection(this.firestore, 'transactions'));
    const data: TransactionTable[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data() as TransactionTable;
      data.push(docData);
    });
    this.dataSource.data = data;
  }

}