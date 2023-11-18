import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private transactionsUpdatedList = new BehaviorSubject<void>(null);
  transactionsUpdated = this.transactionsUpdatedList.asObservable();

  accountTransactionsUpdate() {
    this.transactionsUpdatedList.next(null);
  }
}