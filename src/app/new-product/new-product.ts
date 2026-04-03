import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ProductsService } from '../../../services/products-service';

@Component({
  selector: 'app-new-product',
  providers: [
    provideNativeDateAdapter(),
  ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  templateUrl: './new-product.html',
  styleUrl: './new-product.css',
  standalone: true
})
export class NewProduct implements OnInit{
  registerForm!: FormGroup;
  todayDate: Date = new Date();
  private productsService = inject(ProductsService);

  constructor(private router: Router,
              private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      title: ['', Validators.required],
      city: ['', Validators.required],
      location: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      year: ['', [Validators.required, Validators.min(2000), Validators.max(2026)]],
      condition: [0],
      available: ['', Validators.required],
      giveaway: [false],
    })
  }

  ngOnInit() {
  }

  setCondition(value: number){
    this.registerForm.get('condition')?.setValue(value)
  }

  onSubmit(){
    if(this.registerForm.valid){
      const formData = this.registerForm.value;
      this.productsService.registerProduct(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.log(error)
        }
      });
    }else{
      this.registerForm.markAllAsTouched();
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
