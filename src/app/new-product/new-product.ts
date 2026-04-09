import { ChangeDetectorRef, Component, HostListener, inject, OnInit } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  private productsService = inject(ProductsService);
  userId = JSON.parse(localStorage.getItem('loginUserData') || '{}')?._id;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.activeFilter = null;
    this.cdr.detectChanges();
  }

  constructor(private router: Router,
              private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      title: ['', Validators.required],
      city: ['', Validators.required],
      location: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      year: ['', [Validators.required, Validators.min(2000), Validators.max(2026)]],
      condition: [0],
      available: ['', Validators.required],
      giveaway: [false],
    })
  }

  ngOnInit() {
    this.registerForm.get('giveaway')?.valueChanges.subscribe((isGiveaway: boolean) => {
      if (isGiveaway) {
        this.registerForm.patchValue({
          price: 0
        });

        this.registerForm.get('price')?.disable();
      } else {
        this.registerForm.get('price')?.enable();
      }
    });
  }


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

    console.log(this.registerForm);
  }

  setCondition(value: number){
    this.registerForm.get('condition')?.setValue(value)
  }

  onSubmit(){
    if(this.registerForm.valid){
      const rawData = this.registerForm.getRawValue();

      const formattedData = {
        ...rawData,
        title: rawData.title?.toLowerCase().trim(),
        city: rawData.city?.toLowerCase().trim(),
        location: rawData.location?.toLowerCase().trim(),
        price: Number(rawData.price),
        userId: this.userId
      };
      this.productsService.registerProduct(formattedData).subscribe({
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
