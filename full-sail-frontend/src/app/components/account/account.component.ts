import { Component, OnInit, ElementRef } from '@angular/core';
import { Transaction } from 'src/app/models/transaction';
import { Papa } from 'ngx-papaparse';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  FaFileCsv = faFileCsv;
  
  constructor(private papa: Papa, private el: ElementRef) { }

  paycheck: number = 0;
  contributeToGoals: boolean = true;
  showImportPaycheck: string = "true";
  transactionList: Transaction[] = [];
  csvString: string = ``;
  parsedData: any[] = [];
  paycheckDate: Date = new Date();

  extractedData: any[] = [];
  dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

  inputPaycheck() {
    if (this.paycheck > 0)  {

    this.transactionList.push(new Transaction(this.paycheck.toString(), true, this.paycheckDate, this.contributeToGoals, "Paycheck"));
    this.paycheck = 0;
    console.log(this.transactionList);
    console.log(this.paycheckDate);
    } else {
      alert("Paycheck must be a positive number");
      this.paycheck = 0;
    }
  }

  inputCSV() {
    if (this.csvString){
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
          console.log('Extracted Data:', this.extractedData);

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

      if (transaction.Amount < 0) {
        transactionContribute = null;
      }




      this.transactionList.push(new Transaction(transaction.Amount, transaction.Amount > 0 ? true : false, parsedDate, transactionContribute, transaction.Description))
    });

    console.log(this.transactionList);
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
  



  ngOnInit(): void { 

  }
}
