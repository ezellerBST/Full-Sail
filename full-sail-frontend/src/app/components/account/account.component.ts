import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, doc, setDoc, getDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user: any;
  displayName: string = "";

  constructor(private auth: Auth, private firestore: Firestore) { }

  ngOnInit(): void {
    this.getUserDetails();
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
  }
}