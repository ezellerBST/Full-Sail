
import { Component, AfterViewInit, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Transaction } from 'src/app/models/transaction';
import { Goal } from 'src/app/models/goal';
import { Papa } from 'ngx-papaparse';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, doc, setDoc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FinanceService } from 'src/app/services/finance.service';

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


  constructor(private papa: Papa, 
    private el: ElementRef, 
    private auth: Auth, 
    private firestore: Firestore,
    private financeService: FinanceService, 
    ) { 

    }

  ngOnInit(): void {
    

    this.getUserDetails();
    this.getTransactions();
    this.getGoals();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  _financeService = this.financeService

  paycheckAmount: number = 0;
  contributeToGoals: boolean = true;
  showImportPaycheck: string = "true";
  paycheckDate: Date = new Date();

  transactionList: Transaction[] = [];
  goalList: Goal[] = [];

  csvString: string = ``;
  parsedData: any[] = [];
  extractedData: any[] = [];
  dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  

  user: any;
  displayName: string = "";
  dataSource = new MatTableDataSource<TransactionTable>();
  displayedColumns: string[] = ['date', 'description', 'amount'];

  createGoalExpanded: boolean = false;


  

  // inputTransaction() {
    
  //     if (this.paycheckDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
  //       this.paycheckDate = new Date();
  //     }

  //     const newTransaction = new Transaction(this.paycheck.toString(),  this.paycheckDate, this.contributeToGoals, "Transaction");

  //   this.inputTransactionFromParameter(newTransaction);

  // }

  inputTransactionFromParameter(transaction: Transaction) {

    this.financeService.inputTransactionFromParameter(transaction);

    // this.addTransactions(transaction);
    // this.transactionList.push(transaction);
    // this.addTransactionToGoals(transaction);
    this.paycheckAmount = 0;
    // console.log("Transaction List: ", this.transactionList);
    
  
  }


  async inputPaycheck(paycheckAmount: number, paycheckDate : Date, contributeToGoals : boolean) {
    console.log("start");
    await this.financeService.inputPaycheck(paycheckAmount, paycheckDate, contributeToGoals);
    console.log("paycheckamount = 0")
    this.paycheckAmount = 0;
    

    this.ngOnInit();
    
  }
  

  // inputPaycheck() {
  //   if (this.paycheck > 0)  {
      

  //     if (this.paycheckDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
  //       this.paycheckDate = new Date();
  //     }

  //     const newTransaction = new Transaction(this.paycheck.toString(),  this.paycheckDate, this.contributeToGoals, "Paycheck");

  //   this.inputTransactionFromParameter(newTransaction);

  //   this.paycheck = 0;
    

  //   } else {
  //     alert("Paycheck must be a positive number");
  //     this.paycheck = 0;
  //   }
  // }

  // inputPaycheck() {
  //   this.financeService.inputPaycheck(this.paycheckAmount, this.paycheckDate, this.contributeToGoals);
  // }

  // inputCSV() {
  //   if (this.csvString) {
  //     this.papa.parse(this.csvString, {
  //       header: true,
  //       skipEmptyLines: true,
  //       quoteChar: '"',
  //       complete: (result) => {
  //         this.parsedData = result.data;
  //         this.extractedData = this.parsedData.map(row => ({
  //           "Date": row["Effective Date"],
  //           "Amount": row["Amount"],
  //           "Description": row["Description"]
  //         }));
  //         console.log('Extracted Data: ', this.extractedData);

  //         this.csvToTransactionList();
  //       },
  //       error: (error) => {
  //         console.error(error.message);
  //         this.extractedData = [];
  //         this.csvString = ``;
  //         this.parsedData = [];
  //       }
  //     });
  //   }
  // }

  // csvToTransactionList() {

  //   this.extractedData.forEach(transaction => {

  //     const dateParts = transaction.Date.split('/');

  //     const year = parseInt(dateParts[2], 10);
  //     const month = parseInt(dateParts[0], 10) - 1;
  //     const day = parseInt(dateParts[1], 10);

  //     const parsedDate = new Date(year, month, day);

  //     let transactionContribute = this.contributeToGoals;

  //     if (transaction.Amount <= 0) {
  //       transactionContribute = null;
  //     }


  //     const newTransaction = new Transaction(transaction.Amount,  parsedDate, transactionContribute, transaction.Description);

  //     this.inputTransactionFromParameter(newTransaction);

  //   });

  //   this.extractedData = [];
  //   this.csvString = ``;
  //   this.parsedData = [];
  // }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       const content = reader.result as string;
  //       this.csvString = content;
  //       this.inputCSV();
  //     };

  //     reader.readAsText(file);
  //   }
  // }

  async onFileSelected($event, contributeToGoals) {
    await this.financeService.onFileSelected($event, contributeToGoals);
    
    this.ngOnInit();
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



  // async addTransactions(transaction: Transaction) {
  //   const userDetails = await this.getUserDetails();
  //   if (userDetails && userDetails.uid) {
  //     const userId = userDetails.uid

      

  //     // Iterating through the sample transactions and adding them to Firestore

  //       try {
  //         const docRef = await addDoc(collection(this.firestore, `users/${userId}/transactions`), {
  //           date: transaction.date.toLocaleDateString(),
  //           description: transaction.description,
  //           amount: transaction.amount
  //         });

  //         // Console.log the transaction data after the document is added
  //         const docSnapshot = await getDoc(docRef);
  //         if (docSnapshot.exists()) {
  //           console.log('Transaction data:', docSnapshot.data());
  //         }
  //       } catch (error) {
  //         console.error('Error: ', error);
  //       }
      
  //   }

  //   this.getTransactions();
  // }



   async sampleTransactions() {
    await this.financeService.sampleTransactions();
    this.getGoals();
    this.getTransactions();
   }

  // sampleTransactions() {
    
  //  const transactions = [
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
    console.log("get trans");
    // const userDetails = await this.getUserDetails();
    // if (userDetails && userDetails.uid) {
    //   const userId = userDetails.uid
    //   const querySnapshot = await getDocs(collection(this.firestore, `users/${userId}/transactions`));
      const data: TransactionTable[] = [];

    const transactions = await this.financeService.getTransactions();
      transactions.forEach((doc) => {

        const docData = doc as TransactionTable;

        docData.date = docData.date
        data.push(docData);
      });
      this.dataSource.data = data;
    }
  

  async getGoals() {
    const userDetails = await this.getUserDetails();
    // if (userDetails && userDetails.uid) {
    //   const userId = userDetails.uid
    //   const querySnapshot = await getDocs(collection(this.firestore, `users/${userId}/goals`));
      const goals = await this._financeService.getGoals();

      this.goalList = [];
      goals.forEach((doc) => {
        
        doc.dateCreated = new Date(doc.dateCreated);
        this.goalList.push(doc);
        
      });
      // console.log(this.goalList);    
  }



  // toggleExpansionPanel(panelBool:boolean) {
  //   if (panelBool) {
  //     panelBool = false; 
  //     console.log(this.createGoalExpanded);
  //   } else {
  //     panelBool = true;
  //     console.log(this.createGoalExpanded);
  //   }
  // }



  async createGoal(name:string, amountPerPaycheck:string, total:string) {
    await this.financeService.createGoal(name, amountPerPaycheck, total);
    // this.addGoal(new Goal(name, parseInt(total), parseInt(amountPerPaycheck), 0, new Date()));
    console.log("Goal List: ", this.goalList);
    console.log("create Goal: ", new Date());
    this.getGoals();
  }

  async addGoal(goal: Goal) {
    // const userDetails = await this.getUserDetails();
    // if (userDetails && userDetails.uid) {
    //   const userId = userDetails.uid

      

    //   // Iterating through the sample transactions and adding them to Firestore

    //     try {
    //       const docRef = await addDoc(collection(this.firestore, `users/${userId}/goals`), {
    //         name: goal.name,
    //         total: goal.total,
    //         amountContributed: goal.amountContributed,
    //         balance: goal.balance,
    //         dateCreated: goal.dateCreated.toLocaleDateString()
    //       });

    //       // Console.log the transaction data after the document is added
    //       const docSnapshot = await getDoc(docRef);
    //       if (docSnapshot.exists()) {
    //         console.log('Goal data:', docSnapshot.data());
    //       }
    //     } catch (error) {
    //       console.error('Error: ', error);
    //     }
      
    // }
    this.financeService.addGoal(goal);

    this.getGoals();
  }



  // addTransactionToGoals(transaction : Transaction) {

  //   if (parseInt(transaction.amount) <= 0 || transaction.income === false || (transaction.contributeToGoals === false || null)) {
  //     console.log("addtrantogoal 1st");
  //     return
  //   }
  //   let goalTotal = 0;

  //   this.goalList.forEach(goal => {
  //     goalTotal += goal.amountContributed;
  //   });

  //   console.log("goal Total: ", goalTotal);

  //   if (parseInt(transaction.amount) < goalTotal) {
  //     console.log("addtrantogoal 2st");
  //     return;
  //   }

  //   this.goalList.forEach(goal => {

  //     // const dateParts = goal.dateCreated.toDateString().split('/');

  //     // const year = parseInt(dateParts[2], 10);
  //     // const month = parseInt(dateParts[0], 10) - 1;
  //     // const day = parseInt(dateParts[1], 10);

  //     // const parsedDate = new Date(year, month, day);

  //     const goalDate = goal.dateCreated;
      

      
      

  //     const transactionDate = transaction.date;
  //     console.log("Tran Date");
  //     console.log(transaction.date)

      

  //     if (goalDate <= transactionDate) {
  //       goal.balance += goal.amountContributed;
  //       console.log("success", goal.balance);
  //     } else {
  //       console.log("addtrantogoal 3rd: Tran: ", transaction.date, "Goal: ", goal.dateCreated);
  //     }
      

  //   });
  // }

}
