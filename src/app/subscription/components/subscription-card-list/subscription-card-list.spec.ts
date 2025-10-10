import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCardList } from './subscription-card-list';

describe('SubscriptionCardList', () => {
  let component: SubscriptionCardList;
  let fixture: ComponentFixture<SubscriptionCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionCardList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionCardList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
