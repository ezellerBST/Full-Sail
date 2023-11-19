import { Injectable } from '@angular/core';
import { Firestore, addDoc, doc, setDoc, getDoc, getDocs, collection, deleteDoc } from '@angular/fire/firestore';
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
    private firestore: Firestore,
  ) { }

  async inputPaycheck(paycheckAmount: number, paycheckDate: Date, paycheckToGoals: boolean) {
    if (paycheckAmount > 0) {


      if (paycheckDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
        paycheckDate = new Date();
      }

      const newTransaction = new Transaction(paycheckAmount, paycheckDate, paycheckToGoals, "Paycheck");
      console.log("1");
      await this.inputTransactionFromParameter(newTransaction);



    } else {
      return alert("Paycheck must be a positive number");
    }
  }

  async inputTransactionFromParameter(transaction: Transaction) {
    console.log("2");
    await this.addTransactions(transaction);
    // this.transactionList.push(transaction);
    await this.addTransactionToGoals(transaction);
    // this.paycheck = 0;
    // console.log("Transaction List: ", this.transactionList);
  }

  async inputCSV(csvString: string, contributeToGoals: boolean) {
    if (csvString) {
      this.papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        quoteChar: '"',
        complete: (result) => {
          const parsedData = result.data;
          const extractedData = parsedData.map(row => ({
            "Date": row["Effective Date"],
            "Amount": row["Amount"],
            "Description": row["Description"]
          }));
          console.log('Extracted Data: ', extractedData);

          this.csvToTransactionList(extractedData, contributeToGoals);
        },
        error: (error) => {
          console.error(error.message);
          // this.extractedData = [];
          // this.csvString = ``;
          // this.parsedData = [];
        }
      });
    }
  }

  csvToTransactionList(extractedData: any, contributeToGoals: boolean) {

    extractedData.forEach(transaction => {

      const dateParts = transaction.Date.split('/');

      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[0], 10) - 1;
      const day = parseInt(dateParts[1], 10);

      const parsedDate = new Date(year, month, day);

      let transactionContribute = contributeToGoals;

      if (transaction.Amount <= 0) {
        transactionContribute = null;
      }

      const newTransaction = new Transaction(transaction.Amount, parsedDate, transactionContribute, transaction.Description);

      this.inputTransactionFromParameter(newTransaction);

    });
    // this.extractedData = [];
    // this.csvString = ``;
    // this.parsedData = [];
  }

  onFileSelected(event: any, contributeToGoals: boolean) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = reader.result as string;
        const csvString = content;
        this.inputCSV(csvString, contributeToGoals);
      };

      reader.readAsText(file);
    }
  }

  async getUserDetails() {
    try {
      const userCredential = await this.auth.currentUser;
      if (userCredential) {
        const user = userCredential;
        const displayName = user.displayName;
        return {
          uid: user.uid,
          displayName: displayName
        };
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async addTransactions(transaction: Transaction) {
    const userDetails = await this.getUserDetails();
    if (userDetails && userDetails.uid) {
      const userId = userDetails.uid

      // Iterating through the sample transactions and adding them to Firestore
      try {
        const docRef = await addDoc(collection(this.firestore, `users/${userId}/transactions`), {
          date: transaction.date,
          description: transaction.description,
          amount: transaction.amount,

        });

        // Console.log the transaction data after the document is added
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          console.log('Transaction data:', docSnapshot.data());
        }
      } catch (error) {
        console.error('Error: ', error);
      }

    }
    //console.log("4", "transaction added");

    // this.getTransactions();
  }

  // sampleTransactions() {

  //   const transactions = [
  //     new Transaction("5000", new Date(2023, 10, 1), null, "Salary"),
  //     new Transaction("-250", new Date(2023, 10, 2), null, "Groceries"),
  //     new Transaction("500", new Date(), true, "Paycheck"),
  //     new Transaction("-44.99", new Date(), null, "Xbox Controller")
  //   ];

  //   transactions.forEach(transaction => {
  //     this.inputTransactionFromParameter(transaction);
  //   });
  // }

  async getTransactions() {
    const userDetails = await this.getUserDetails();
    if (userDetails && userDetails.uid) {
      const userId = userDetails.uid
      const querySnapshot = await getDocs(collection(this.firestore, `users/${userId}/transactions`));
      // const data: TransactionTable[] = [];
      let result = [];
      querySnapshot.forEach((doc) => {

        const docData = doc.data();
        // const docData = doc.data() as TransactionTable;

        docData.date = docData.date
        docData.id = doc.id
        // data.push(docData);
        result.push(docData);
      });
      // this.dataSource.data = data;
      console.log(result);
      return result
    } else {
      return null;
    }
  }

  async getGoals() {
    const userDetails = await this.getUserDetails();
    if (userDetails && userDetails.uid) {
      const userId = userDetails.uid
      const querySnapshot = await getDocs(collection(this.firestore, `users/${userId}/goals`));
      let goalList = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        docData.dateCreated = new Date(docData.dateCreated);
        goalList.push(docData);
      });

      return goalList;
    } else {
      return null;
    }
  }



  createGoal(name: string, amountPerPaycheck: string, total: string) {
    this.addGoal(new Goal(name, parseInt(total), parseInt(amountPerPaycheck), 0, new Date()));
    // console.log("Goal List: ", this.goalList);
    console.log("create Goal: ", new Date());
  }

  async addGoal(goal: Goal) {
    const userDetails = await this.getUserDetails();
    if (userDetails && userDetails.uid) {
      const userId = userDetails.uid

      // Iterating through the sample transactions and adding them to Firestore

      try {
        const docRef = await addDoc(collection(this.firestore, `users/${userId}/goals`), {
          name: goal.name,
          total: goal.total,
          amountContributed: goal.amountContributed,
          balance: goal.balance,
          dateCreated: goal.dateCreated
        });

        // Console.log the transaction data after the document is added
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          console.log('Goal data:', docSnapshot.data());
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    }
    // this.getGoals();
  }


//NEED TO ADD UPDATE AND DELETE FUNCTIONS FOR GOALS CARD

//NEED TO ADD SETDOC FOR addTransactionToGoals() FOR GOALS UPDATE IN FIRESTORE
  // async is new
  async addTransactionToGoals(transaction: Transaction) {

    if (transaction.amount <= 0 || transaction.income === false || (transaction.contributeToGoals === false || null)) {
      console.log("addtrantogoal 1st");
      return
    }
    let goalTotal = 0;
    const goalList = await this.getGoals();
    await goalList.forEach(goal => {
      goalTotal += goal.amountContributed;
    });

    console.log("goal Total: ", goalTotal);

    if (transaction.amount < goalTotal) {
      console.log("addtrantogoal 2st");
      return;
    }

    goalList.forEach(goal => {
      const goalDate = goal.dateCreated;
      const transactionDate = transaction.date;
      console.log("Tran Date");
      console.log(transaction.date)

      if (goalDate <= transactionDate) {
        goal.balance += goal.amountContributed;
        
        

        console.log("success", goal.balance);
      } else {
        console.log("addtrantogoal 3rd: Tran: ", transaction.date, "Goal: ", goal.dateCreated);
      }
    });
  }

  openTransactionDialog() {
    this.dialog.open(AddTransactionComponent, {
      width: '55%',
      height: '45%'
    })
  }

  openEditTransactionDialog(transactionId, date, amount, description) {
    this.dialog.open(EditTransactionComponent, {
      width: '55%',
      height: '45%',
      data: { transactionId, date, amount, description }
    })
  }

  openDeleteTransactionDialog(transactionId) {
    this.dialog.open(DeleteTransactionComponent, {
      width: '35%',
      height: '25%',
      data: { transactionId }
    });
  }

  // async openTransactionButton(date, amount, description) {
  //   const userDetails = await this.getUserDetails();
  //   try {
  //     if (userDetails && userDetails.uid) {
  //       const userId = userDetails.uid;
  //       const docRef = addDoc(collection(this.firestore, `users/${userId}/transactions`), {
  //         date: date,
  //         description: description,
  //         amount: amount
  //       });
  //       console.log(date, amount, description);
  //       const docSnapshot = await getDoc(docRef);
  //       if (docSnapshot.exists()) {
  //         console.log('Transaction data:', docSnapshot.data());

  //       }

  //     }
  //   } catch (err) {
  //     console.error('Error: ', err);
  //   }
  // }

  async editTransactionButton(transactionId, date, amount, description) {
    const userDetails = await this.getUserDetails();

    if (userDetails && userDetails.uid) {
      const userId = userDetails.uid;
      const transactionDocRef = doc(this.firestore, `users/${userId}/transactions/${transactionId}`);
      console.log(transactionId);
      const data = { date: date, amount: amount, description: description };
      try {
        await setDoc(transactionDocRef, data, { merge: true });
        console.log('Updated data: ', data);
      } catch (error) {
        console.error('Error: ', error);
      }
    }
  }

  async deleteTransactionButton(transactionId) {
    const userDetails = await this.getUserDetails();

    if (userDetails && userDetails.uid) {
      const userId = userDetails.uid;
      const transactionDocRef = doc(this.firestore, `users/${userId}/transactions/${transactionId}`);
      console.log(transactionId);
      try {
        await deleteDoc(transactionDocRef);
        console.log('Transaction deleted');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
