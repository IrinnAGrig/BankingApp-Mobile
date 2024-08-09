import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CardService } from 'src/app/shared/services/card/card.service';
import { RequestsService } from 'src/app/shared/services/requests/requests.service';
import { Transaction } from 'src/app/shared/services/transaction/transactions.model';
import { TransactionService } from 'src/app/shared/services/transaction/transactions.service';
import { TranslationService } from 'src/app/shared/services/translation.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  showChart = false;
  balance = 0;
  transactions: Transaction[] = [];
  chartTransactions: Transaction[] = [];
  chartPieTransactions: Transaction[] = [];
  notifications = 0;

  constructor(private translate: TranslationService, 
    private cardService: CardService,
    private transactionService: TransactionService,
    private router: Router, 
    private requestsService: RequestsService){
    this.translate.useTranslation('statistics');
    this.cardService.getCardsByIdUser().subscribe(res => {
      res.forEach(el => this.balance += el.balance)
    })
    this.transactionService.getJustPartTransactions(5).subscribe(trans => {
      this.transactions = trans;
    })
    this.transactionService.gettransactionsByIdUser().subscribe(trans => {
      this.chartTransactions = trans;
    })
    this.requestsService.getNumberOpened().subscribe(res => this.notifications = res);
  }

  goToTransactions(){
    this.router.navigate(['/transaction-history']);
  }
  clodePieChart(mode: boolean){
    this.showChart = mode;
  }
  openPieChart(month: number | null){
    if(typeof month == 'number'){
      this.showChart = true;
      this.transactionService.gettransactionsByIdUser().subscribe(res => {
        this.chartPieTransactions = this.filterTransactionsByMonth(month, res);
      })
    }
  }
  goToLocation(){
    this.router.navigate(['/home']);
  }
  filterTransactionsByMonth(month: number, tran: Transaction[]): Transaction[] {
    return tran.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === (new Date()).getFullYear();
    });
  }
}
