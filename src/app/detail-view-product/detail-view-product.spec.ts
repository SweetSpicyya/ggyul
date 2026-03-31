import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewProduct } from './detail-view-product';

describe('DetailViewProduct', () => {
  let component: DetailViewProduct;
  let fixture: ComponentFixture<DetailViewProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailViewProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailViewProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
