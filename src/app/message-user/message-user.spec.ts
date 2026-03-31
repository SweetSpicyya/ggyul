import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageUser } from './message-user';

describe('MessageUser', () => {
  let component: MessageUser;
  let fixture: ComponentFixture<MessageUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageUser],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
