import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyProduct } from './view-my-product';

describe('ViewMyProduct', () => {
  let component: ViewMyProduct;
  let fixture: ComponentFixture<ViewMyProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMyProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
