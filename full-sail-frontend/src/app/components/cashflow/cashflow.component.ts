import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { Transaction } from "src/app/models/transaction";
import { FinanceService } from "src/app/services/finance.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['./cashflow.component.css']
})
export class CashflowComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private financeService: FinanceService) {





    this.chartOptions = {
      series: [

        {
          name: "Income",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 76, 85, 101]
        },
        {
          name: "Expenses",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 35, 41, 36]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",

        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      },
      yaxis: {
        title: {
          text: "$ (USD)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val;
          }
        }
      }
    };
  }

  async ngOnInit() {

  }

  public async loadData(data) {

    try{
      

      const currentYear = new Date().getUTCFullYear();

      const monthData = {
        0: { name: 'Jan', income: 0, expenses: 0 },
        1: { name: 'Feb', income: 0, expenses: 0 },
        2: { name: 'Mar', income: 0, expenses: 0 },
        3: { name: 'Apr', income: 0, expenses: 0 },
        4: { name: 'May', income: 0, expenses: 0 },
        5: { name: 'Jun', income: 0, expenses: 0 },
        6: { name: 'Jul', income: 0, expenses: 0 },
        7: { name: 'Aug', income: 0, expenses: 0 },
        8: { name: 'Sep', income: 0, expenses: 0 },
        9: { name: 'Oct', income: 0, expenses: 0 },
        10: { name: 'Nov', income: 0, expenses: 0 },
        11: { name: 'Dec', income: 0, expenses: 0 },
      };

      const filteredData = data.filter(transaction => {
        const transactionYear = new Date(transaction.date).getUTCFullYear();
        return transactionYear === currentYear;
      })

      filteredData.forEach(transaction => {
        const transactionMonth = new Date(transaction.date).getUTCMonth();
        if (transaction.amount > 0) {
          monthData[transactionMonth].income += parseInt(transaction.amount || '0');
        } else {
          monthData[transactionMonth].expenses -= parseInt(transaction.amount || '0');

        }
      });

      this.chartOptions.series = [
        {
          name: "Income",
          data: Object.values(monthData).map(month => month.income)
        },
        {
          name: "Expenses",
          data: Object.values(monthData).map(month => month.expenses)
        },

      ];


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

}
