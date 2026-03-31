import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyProduct } from './edit-my-product';

describe('EditMyProduct', () => {
  let component: EditMyProduct;
  let fixture: ComponentFixture<EditMyProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMyProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMyProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
