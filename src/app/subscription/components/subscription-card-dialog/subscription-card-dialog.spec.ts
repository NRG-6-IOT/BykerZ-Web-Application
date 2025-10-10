import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCardDialog } from './subscription-card-dialog';

describe('SubscriptionCardDialog', () => {
  let component: SubscriptionCardDialog;
  let fixture: ComponentFixture<SubscriptionCardDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionCardDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionCardDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
