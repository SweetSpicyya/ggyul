import { ChangeDetectorRef, Component, inject, OnInit, HostListener } from '@angular/core';
import { ProductsService } from '../../../services/products-service';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConsoleLogger } from '@angular/compiler-cli';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home  implements OnInit  {
  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  products: any;
  private userId = localStorage.getItem('user_id');

  ngOnInit() {

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;

        if (this.userId) {
          this.productService.getMyFavourites(this.userId).subscribe({
            next: (favIds: string[]) => {
              this.products = this.products.map((p: any) => ({
                ...p,
                isFavourite: favIds.includes(p._id.toString())
              }));
            }

          });
        }
        this.cdr.detectChanges();
      },
      error: (e) => console.log('fail : ', e)
    })
  }

  setFav(event: Event, product: any){
    event.stopPropagation();
    if (!this.userId) {
      Swal.fire({
        html: `
          <div style="font-size: 55px; margin-top: 5px;">🍊</div>
          <div class="swal2-title" style="margin-bottom: 10px;">Sign-in Required</div>
          <div class="swal2-html-container">Please log in to save your favorite items!</div>
        `,
        text: 'Please log in to add this item to your favorites!',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'swal2-confirm',
          cancelButton: 'swal2-cancel',
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container'
        },
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Maybe later',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/loginUser']);
        }
      });
      return;
    }

    this.productService.setFavourite(product._id).subscribe({
      next: (res) => {
        product.isFavourite = res.isFavourite;

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fail to set Favourite:', err)
    });
  }



  activeFilter: string | null = null;
  selectedCity: string = '';
  selectedPrice: number | null = null;
  selectedCondition: number | null = null;

  toggleFilter(event: Event, type: string) {
    event.stopPropagation();
    this.activeFilter = this.activeFilter === type ? null : type;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.activeFilter = null;
  }

  setCity(city: string) {
    this.selectedCity = city;
    this.activeFilter = null;
    this.loadProducts();
  }

  loadProducts() {
    const params: any = {};
    if (this.selectedCity) params.city = this.selectedCity;
    if (this.selectedPrice) params.maxPrice = this.selectedPrice;
    if (this.selectedPrice) params.minPrice = this.selectedPrice;
    if (this.selectedCondition) params.condition = this.selectedPrice;

    this.productService.getFilteredProducts(params).subscribe((data: any) => {
      this.products = data;
      this.cdr.detectChanges();
    });
  }

}

