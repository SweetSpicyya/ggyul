import { ChangeDetectorRef, Component, inject, OnInit, HostListener } from '@angular/core';
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.activeFilter = null;
    this.cdr.detectChanges();
  }
  ngOnInit() {
    const pId = this.route.snapshot.paramMap.get('id');

    this.registerForm.get('giveaway')?.valueChanges.subscribe((isGiveaway) => {
      const priceControl = this.registerForm.get('price');
      if (isGiveaway) {
        priceControl?.setValue(0, { emitEvent: false });
        priceControl?.disable();
      } else {
        priceControl?.enable();
      }
    });

    if (pId) {
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
            available: data.date_avaliable ? new Date(data.date_avaliable) : null,
            giveaway: data.giveaway
          });

          if (data.giveaway) {
            this.registerForm.get('price')?.disable();
          }

          this.cdr.detectChanges();
        },
        error: (e) => console.log('fail : ', e)
      });
    }
  }

  registerForm = this.fb.group({
    title: ['', Validators.required],
    city: ['', Validators.required],
    location: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    year: ['', [Validators.required, Validators.min(2000), Validators.max(2026)]],
    condition: [0],
    available: [null as any, Validators.required],
    giveaway: [false],
  });

  activeFilter: string | null = null;
  toggleSelect(event: Event, type: string) {
    event.stopPropagation();
    event.preventDefault();
    this.activeFilter = this.activeFilter === type ? null : type;
  }

  setCity(event: Event, cityName: string) {
    event.stopPropagation();

    if(cityName !== this.registerForm.get('city')?.value) {
      this.registerForm.get('city')?.setValue(cityName);
      this.registerForm.get('city')?.markAsTouched();
      this.registerForm.get('location')?.setValue('');
    }
    this.activeFilter = null;
    this.cdr.detectChanges();
  }

  setLocation(event: Event, locationName: string) {
    event.stopPropagation();

    if(locationName !== this.registerForm.get('location')?.value){
      this.registerForm.get('location')?.setValue(locationName);
      this.registerForm.get('location')?.markAsTouched();
    }
    this.activeFilter = null;
    this.cdr.detectChanges();
  }

  setGiveaway(event: Event, isGiveaway: boolean){
    event.stopPropagation();

    this.registerForm.get('giveaway')?.setValue(isGiveaway);
    this.registerForm.get('price')?.setValue(0);
    this.registerForm.get('giveaway')?.markAsTouched();

    this.activeFilter = null;
    this.cdr.detectChanges();

  }

  setCondition(value: number){
    this.registerForm.get('condition')?.setValue(value)
  }


  onSubmit(){
    const pId = this.route.snapshot.paramMap.get('id');

    if(this.registerForm.valid){
      const rawData = this.registerForm.value;

      const formattedData = {
        ...rawData,
        title: rawData.title?.toLowerCase().trim(),
        city: rawData.city?.toLowerCase().trim(),
        location: rawData.location?.toLowerCase().trim(),
        price: Number(rawData.price)
      };

      if(pId) {
        this.productService.updateProduct(pId, formattedData).subscribe({
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
