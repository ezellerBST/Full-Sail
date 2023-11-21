import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGoalComponent } from './delete-goal.component';

describe('DeleteGoalComponent', () => {
  let component: DeleteGoalComponent;
  let fixture: ComponentFixture<DeleteGoalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteGoalComponent]
    });
    fixture = TestBed.createComponent(DeleteGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
