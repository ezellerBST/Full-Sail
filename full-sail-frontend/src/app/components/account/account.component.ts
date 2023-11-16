
import { Component, AfterViewInit, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Transaction } from 'src/app/models/transaction';
import { Goal } from 'src/app/models/goal';
import { Papa } from 'ngx-papaparse';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, doc, setDoc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FinanceService } from 'src/app/services/finance.service';

export interface TransactionTable {
  date: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountComponent implements OnInit, AfterViewInit {


  FaFileCsv = faFileCsv;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private papa: Papa,
    private el: ElementRef,
    private auth: Auth,
    private firestore: Firestore,
    private financeService: FinanceService) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.getTransactions();
    this.getGoals();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  paycheck: number = 0;
  contributeToGoals: boolean = true;
  showImportPaycheck: string = "true";
  paycheckDate: Date = new Date();

  transactionList: Transaction[] = [];
  goalList: Goal[] = [];
  createGoalExpanded: boolean = false;

  csvString: string = ``;
  parsedData: any[] = [];
  extractedData: any[] = [];
  dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

  user: any;
  displayName: string = "";
  dataSource = new MatTableDataSource<TransactionTable>();
  // displayedColumns: string[] = ['date', 'description', 'amount'];
  columnsToDisplay = ['date', 'description', 'amount'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any | null;

  editTransaction() {
    this.financeService.openEditTransactionDialog();
  }

  deleteTransaction() {
    this.financeService.openDeleteTransactionDialog();
  }

  inputTransaction() {

    if (this.paycheckDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
      this.paycheckDate = new Date();
    }

    const newTransaction = new Transaction(this.paycheck.toString(), this.paycheckDate, this.contributeToGoals, "Transaction");

    this.inputTransactionFromParameter(newTransaction);

  }

  inputTransactionFromParameter(transaction: Transaction) {
    this.addTransactions(transaction);
    this.transactionList.push(transaction);
    this.addTransactionToGoals(transaction);
    this.paycheck = 0;
    console.log("Transaction List: ", this.transactionList);
  }



  inputPaycheck() {
    if (this.paycheck > 0) {


      if (this.paycheckDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
        this.paycheckDate = new Date();
      }

      const newTransaction = new Transaction(this.paycheck.toString(), this.paycheckDate, this.contributeToGoals, "Paycheck");

      this.inputTransactionFromParameter(newTransaction);

      this.paycheck = 0;


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


      const newTransaction = new Transaction(transaction.Amount, parsedDate, transactionContribute, transaction.Description);

      this.inputTransactionFromParameter(newTransaction);

    });

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
        return {
          uid: this.user.uid,
          displayName: this.displayName
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
          date: transaction.date.toLocaleDateString(),
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

    }

    this.getTransactions();
  }

  sampleTransactions() {

    const transactions = [
      new Transaction("5000", new Date(2023, 10, 1), false, "Salary"),
      new Transaction("-250", new Date(2023, 10, 2), null, "Groceries"),
      new Transaction("500", new Date(), true, "Paycheck"),
      new Transaction("-44.99", new Date(), null, "Xbox Controller")
    ];

    transactions.forEach(transaction => {
      this.inputTransactionFromParameter(transaction);
    });
  }

  async getTransactions() {
    const userDetails = await this.getUserDetails();
    if (userDetails && userDetails.uid) {
      const userId = userDetails.uid
      const querySnapshot = await getDocs(collection(this.firestore, `users/${userId}/transactions`));
      const data: TransactionTable[] = [];
      querySnapshot.forEach((doc) => {

        const docData = doc.data() as TransactionTable;

        docData.date = docData.date
        data.push(docData);
      });
      this.dataSource.data = data;
    }
  }

  async getGoals() {
    const userDetails = await this.getUserDetails();
    if (userDetails && userDetails.uid) {
      const userId = userDetails.uid
      const querySnapshot = await getDocs(collection(this.firestore, `users/${userId}/goals`));
      this.goalList = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        docData.dateCreated = new Date(docData.dateCreated);
        this.goalList.push(docData);
      });

    }
  }

  toggleExpansionPanel(panelBool: boolean) {
    if (panelBool) {
      panelBool = false;
      console.log(this.createGoalExpanded);
    } else {
      panelBool = true;
      console.log(this.createGoalExpanded);
    }
  }

  createGoal(name: string, amountPerPaycheck: string, total: string) {
    this.addGoal(new Goal(name, parseInt(total), parseInt(amountPerPaycheck), 0, new Date()));
    console.log("Goal List: ", this.goalList);
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
          dateCreated: goal.dateCreated.toLocaleDateString()
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

    this.getGoals();
  }



  addTransactionToGoals(transaction: Transaction) {

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

      // const dateParts = goal.dateCreated.toDateString().split('/');

      // const year = parseInt(dateParts[2], 10);
      // const month = parseInt(dateParts[0], 10) - 1;
      // const day = parseInt(dateParts[1], 10);

      // const parsedDate = new Date(year, month, day);

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

}
