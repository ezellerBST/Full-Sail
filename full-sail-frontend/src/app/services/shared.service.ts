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

  private profileDataUpdated = new BehaviorSubject<void>(null);
  updtedProfileCard = this.profileDataUpdated.asObservable();

  profileCardUpdate() {
    this.profileDataUpdated.next(null);
  }
}