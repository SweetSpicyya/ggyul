import { ChangeDetectorRef, Component, inject, OnInit, HostListener } from '@angular/core';
import { ProductsService } from '../../../services/products-service';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
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
  selectedLocation: string = '';
  selectedCondition: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  currentSort: string = 'newest';

  toggleFilter(event: Event, type: string) {
    event.stopPropagation();
    this.activeFilter = this.activeFilter === type ? null : type;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.activeFilter = null;
  }

  setCity(city: string) {
    this.selectedLocation = city;
    this.activeFilter = null;
    this.loadProducts();
  }

  getPriceLabel(): string {
    if(this.minPrice !== null && this.maxPrice !== null){
      return `$ ${this.minPrice} - $ ${this.maxPrice}`
    }
    if(this.minPrice !== null){
      return `Over $ ${this.minPrice}`;
    }
    if(this.maxPrice !== null){
      return `Under $ ${this.maxPrice}`;
    }
    return 'Price';
  }

  setPrice(){
    this.activeFilter = null;
    this.loadProducts();
  }

  setCondition(condition: number) {
    this.selectedCondition = condition;
    this.activeFilter = null;
    this.loadProducts();
  }

  setSort(sortType: string){
    this.currentSort = sortType;
    this.loadProducts();
  }

  loadProducts() {
    const params: any = {
      sort: this.currentSort
    };
    if (this.selectedLocation) params.location = this.selectedLocation;
    if (this.minPrice) params.minPrice = this.minPrice;
    if (this.maxPrice) params.maxPrice = this.maxPrice;
    if (this.selectedCondition) params.condition = this.selectedCondition;

    this.productService.getFilteredProducts(params).subscribe((data: any) => {
      this.products = data;
      this.cdr.detectChanges();
    });
  }


  getRelativeTime(date: any): string {
    if (!date) return '';

    const now = new Date();
    const created = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo`;

    return `${Math.floor(diffInMonths / 12)}y`;
  }


  goToRegister() {
    this.router.navigate(['/newproduct']);
  }

}

