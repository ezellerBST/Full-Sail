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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FinanceService } from 'src/app/services/finance.service';
import { CashflowComponent } from '../cashflow/cashflow.component';
import { SharedService } from 'src/app/services/shared.service';
// import { CashflowComponent } from '../cashflow/cashflow.component';

export interface TransactionTable {
  date: string;
  description: string;
  amount: string;
  id: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountComponent implements OnInit, AfterViewInit {


  FaFileCsv = faFileCsv;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('cashflow') cashflow: CashflowComponent;


  constructor(private papa: Papa,
    private el: ElementRef,
    private auth: Auth,
    private firestore: Firestore,
    private financeService: FinanceService,
    private sharedService: SharedService) {
    this.sharedService.transactionsUpdated.subscribe(() => {
      this.getTransactions();
    });
  }

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

  _financeService = this.financeService

  paycheckAmount: number = 0;
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

  addTransaction() {
    this.financeService.openTransactionDialog();
  }

  editTransaction(transactionId, date, amount, description) {
    this.financeService.openEditTransactionDialog(transactionId, date, amount, description);
  }

  deleteTransaction(transactionId) {
    this.financeService.openDeleteTransactionDialog(transactionId);
  }

  addNewGoalDialog(){
    this.financeService.openCreateGoalDialog();
  }

  editGoalDialog(goalId, nameOfGoal, amountPerPaycheck, total){
    this.financeService.openEditGoalDialog(goalId, nameOfGoal, amountPerPaycheck, total);
  }

  deleteGoalDialog(goalId){
    this.financeService.openDeleteGoalDialog(goalId);
  }
  

  async inputPaycheck(paycheckAmount: number, paycheckDate: Date, contributeToGoals: boolean) {
    console.log("start");
    await this.financeService.inputPaycheck(paycheckAmount, paycheckDate, contributeToGoals);
    console.log("paycheckamount = 0")
    this.paycheckAmount = 0;


    this.ngOnInit();

  }
 

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



  async getTransactions() {

    const data: TransactionTable[] = [];

    const transactions = await this.financeService.getTransactions();
    transactions.forEach((doc) => {
    

      const docData = doc as TransactionTable;
      
      let amount  = parseInt(docData.amount);
        docData.amount = amount.toFixed(2);

      docData.date = new Date(docData.date).toLocaleDateString();
      data.push(docData);
    });
    this.dataSource.data = data;

      if (this.cashflow) {
      this.cashflow.loadData(transactions);
      }
    }
  

  async getGoals() {
    const goals = await this.financeService.getGoals();

    this.goalList = [];
    goals.forEach((doc) => {

      doc.dateCreated = new Date(doc.dateCreated);
      this.goalList.push(doc);

    });
   
  }



  async createGoal(name: string, amountPerPaycheck: string, total: string) {
    await this.financeService.createGoal(name, parseInt(amountPerPaycheck), parseInt(total));
    console.log("Goal List: ", this.goalList);
    console.log("create Goal: ", new Date());
    this.getGoals();
  }


  async addGoal(goal: Goal) {

    this.financeService.addGoal(goal);

    this.getGoals();
  }

}
