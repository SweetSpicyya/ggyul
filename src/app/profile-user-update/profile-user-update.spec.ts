import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUserUpdate } from './profile-user-update';

describe('ProfileUserUpdate', () => {
  let component: ProfileUserUpdate;
  let fixture: ComponentFixture<ProfileUserUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileUserUpdate],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileUserUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
