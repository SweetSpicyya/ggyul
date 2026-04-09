import { ChangeDetectorRef, Component, inject, OnInit, HostListener } from '@angular/core';
import { ProductsService } from '../../../services/products-service';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alert';

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
  private alertService = inject(AlertService);
  products: any;
  userId = JSON.parse(localStorage.getItem('loginUserData') || '{}')?._id;


  conditionLabel: {[key: number]: string} = {
    [-1]: '✨All',
    0: '🌟 BNIB',
    1: '💎 Like New',
    2: '👍 Excellent',
    3: '👌 Good'
  };

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
              this.cdr.detectChanges();
            }
          });
        }else{
          this.cdr.detectChanges();
        }
      },
      error: (e) => console.log('fail : ', e)
    })
  }

  setFav(event: Event, product: any){
    event.stopPropagation();
    if (!this.userId) {
      this.alertService.showLoginRequired('Please log in to add this item to your favorites!');
      return;
    }

    this.productService.setFavourite(product._id, this.userId).subscribe({
      next: (res) => {
        product.isFavourite = res.isFavourite;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fail to set Favourite:', err)
    });
  }

  searchKeyword: string | null = null;
  activeFilter: string | null = null;
  selectedCity: string = '';
  selectedLocation: string = '';
  selectedCondition: number = -1;
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
    this.selectedCity = city;
    this.activeFilter = null;
    this.loadProducts();
  }

  setLocation(location: string) {
    this.selectedLocation = location;
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
    if (this.searchKeyword) params.keyword = this.searchKeyword?.trim();
    if (this.selectedCity) params.city = this.selectedCity?.toLowerCase().trim();
    if (this.selectedLocation) params.location = this.selectedLocation?.toLowerCase().trim();
    if (this.minPrice) params.minPrice = this.minPrice;
    if (this.maxPrice) params.maxPrice = this.maxPrice;
    if (this.selectedCondition) params.condition = this.selectedCondition;

    this.productService.getFilteredProducts(params).subscribe((data: any) => {
      this.products = [...data];
      this.cdr.detectChanges();
    });
  }

  getRelativeTime(date: any): string {
    if (!date) return '';

    const diff = Date.now() - new Date(date).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);

    if (mins  < 1)  return 'Just now';
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days  < 7)  return `${days}d ago`;
    if (days  < 30) return `${Math.floor(days / 7)}w ago`;
    return new Date(date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  }

  onSearch() {
    this.loadProducts();
  }

  goToRegister() {
    if (!this.userId) {
      this.alertService.showLoginRequired('Please log in to add new product!');
      return;
    }
    this.router.navigate(['/newproduct']);
  }

  resetFilters() {
    this.searchKeyword = '';
    this.selectedCity = '';
    this.selectedLocation = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedCondition = -1;
    this.currentSort = 'latest';

    this.activeFilter = null;
    this.loadProducts();

    this.cdr.detectChanges();
  }
}

