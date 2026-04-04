import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products-service';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-my-product',
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-my-product.html',
  styleUrl: './edit-my-product.css',
  standalone: true,
})
export class EditMyProduct implements OnInit  {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  todayDate: Date = new Date();
  product: any;

  ngOnInit() {
    const pId = this.route.snapshot.paramMap.get('id');

    if(pId){
      this.productService.getProductById(pId).subscribe({
        next: (data) => {
          this.product = data;

          this.registerForm.patchValue({
            title: data.title,
            city: data.city_name,
            location: data.location_name,
            price: data.price,
            year: data.year_purchase,
            condition: data.product_condition,
            available: new Date(data.date_avaliable),
            giveaway: data.giveaway
          });

          this.cdr.detectChanges();
        },
        error: (e) => console.log('fail : ', e)
      })
    }
  }

  registerForm = this.fb.group({
    title: ['', Validators.required],
    city: ['', Validators.required],
    location: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    year: ['', [Validators.required, Validators.min(2000), Validators.max(2026)]],
    condition: [0],
    available: [null as any, Validators.required],
    giveaway: [false],
  });

  setCondition(value: number){
    this.registerForm.get('condition')?.setValue(value)
  }

  onSubmit(){
    const pId = this.route.snapshot.paramMap.get('id');

    if(this.registerForm.valid){
      const formData = this.registerForm.value;
      if(pId) {
        this.productService.updateProduct(pId, formData).subscribe({
          next: (response) => {
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.log(error)
          }
        });
      }
    }else{
      this.registerForm.markAllAsTouched();
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
