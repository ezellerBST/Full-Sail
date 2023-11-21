import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTransactionComponent } from './delete-transaction.component';

describe('DeleteTransactionComponent', () => {
  let component: DeleteTransactionComponent;
  let fixture: ComponentFixture<DeleteTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTransactionComponent]
    });
    fixture = TestBed.createComponent(DeleteTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
