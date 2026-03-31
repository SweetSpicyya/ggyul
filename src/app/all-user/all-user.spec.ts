import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUser } from './all-user';

describe('AllUser', () => {
  let component: AllUser;
  let fixture: ComponentFixture<AllUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUser],
    }).compileComponents();

    fixture = TestBed.createComponent(AllUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
