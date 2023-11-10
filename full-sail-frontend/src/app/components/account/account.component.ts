
import { Component, AfterViewInit, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Transaction } from 'src/app/models/transaction';
import { Goal } from 'src/app/models/goal';
import { Papa } from 'ngx-papaparse';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
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


  FaFileCsv = faFileCsv;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private papa: Papa, private el: ElementRef, private auth: Auth, private firestore: Firestore) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.getTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  paycheck: number = 0;
  contributeToGoals: boolean = true;
  showImportPaycheck: string = "true";
  paycheckDate: Date = new Date();

  transactionList: Transaction[] = [];
  goalList: Goal[] = [
    new Goal("Car", 5000, 250, 2550, new Date(2023, 8, 11))
  ];

  csvString: string = ``;
  parsedData: any[] = [];
  extractedData: any[] = [];
  dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  

  user: any;
  displayName: string = "";
  dataSource = new MatTableDataSource<TransactionTable>();
  displayedColumns: string[] = ['date', 'description', 'amount'];


  createGoalExpanded: boolean = false;

  

  inputPaycheck() {
    if (this.paycheck > 0)  {
      

      if (this.paycheckDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
        this.paycheckDate = new Date();
      }

      const newTransaction = new Transaction(this.paycheck.toString(), true, this.paycheckDate, this.contributeToGoals, "Paycheck");

    this.transactionList.push(newTransaction);
    this.addTransactionToGoals(newTransaction);
    this.paycheck = 0;
    console.log("Transaction List: ", this.transactionList);

    } else {
      alert("Paycheck must be a positive number");
      this.paycheck = 0;
    }
  }

  inputCSV() {
    if (this.csvString) {
      this.papa.parse(this.csvString, {
        header: true,
        skipEmptyLines: true,
        quoteChar: '"',
        complete: (result) => {
          this.parsedData = result.data;
          this.extractedData = this.parsedData.map(row => ({
            "Date": row["Effective Date"],
            "Amount": row["Amount"],
            "Description": row["Description"]
          }));
          console.log('Extracted Data: ', this.extractedData);

          this.csvToTransactionList();
        },
        error: (error) => {
          console.error(error.message);
          this.extractedData = [];
          this.csvString = ``;
          this.parsedData = [];
        }
      });
    }
  }

  csvToTransactionList() {

    this.extractedData.forEach(transaction => {

      const dateParts = transaction.Date.split('/');

      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[0], 10) - 1;
      const day = parseInt(dateParts[1], 10);

      const parsedDate = new Date(year, month, day);

      let transactionContribute = this.contributeToGoals;

      if (transaction.Amount <= 0) {
        transactionContribute = null;
      }


      const newTransaction = new Transaction(transaction.Amount, transaction.Amount > 0 ? true : false, parsedDate, transactionContribute, transaction.Description);

      this.transactionList.push(newTransaction);
      this.addTransactionToGoals(newTransaction);

    });

    console.log("Transaction List: ", this.transactionList);
    this.extractedData = [];
    this.csvString = ``;
    this.parsedData = [];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = reader.result as string;
        this.csvString = content;
        this.inputCSV();
      };

      reader.readAsText(file);
    }
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
    
            // Console.log the transaction data after the document is added
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

  toggleExpansionPanel(panelBool:boolean) {
    if (panelBool) {
      panelBool = false; 
      console.log(this.createGoalExpanded);
    } else {
      panelBool = true;
      console.log(this.createGoalExpanded);
    }
  }

  createGoal(name:string, amountPerPaycheck:string, total:string) {
    this.goalList.push(new Goal(name, parseInt(total), parseInt(amountPerPaycheck), 0, new Date()));
    console.log("Goal List: ", this.goalList);
  }

  testGoals = []

  addTransactionToGoals(transaction : Transaction) {

    if (parseInt(transaction.amount) <= 0 || transaction.income === false || (transaction.contributeToGoals === false || null)) {
      console.log("addtrantogoal 1st");
      return
    }
    let goalTotal = 0;

    this.goalList.forEach(goal => {
      goalTotal += goal.amountContributed;
    });

    console.log("goal Total: ", goalTotal);

    if (parseInt(transaction.amount) < goalTotal) {
      console.log("addtrantogoal 2st");
      return;
    }

    this.goalList.forEach(goal => {
      const goalDate = goal.dateCreated;
      // goalDate.setHours(0, 0, 0, 0);

      const transactionDate = transaction.date;
      // transactionDate.setHours(0, 0, 0, 0);

      if (goalDate <= transactionDate) {
        goal.balance += goal.amountContributed;
        console.log("success", goal.balance);
      } else {
        console.log("addtrantogoal 3rd: Tran: ", transaction.date, "Goal: ", goal.dateCreated);
      }
      

    });
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
