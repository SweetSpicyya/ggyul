import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products-service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert';

@Component({
  selector: 'app-detail-view-product',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-view-product.html',
  styleUrl: './detail-view-product.css',
  standalone: true,
})
export class DetailViewProduct implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private alertService = inject(AlertService);
  product: any;
  userId = JSON.parse(localStorage.getItem('loginUserData') || '{}')?._id;

  ngOnInit() {
    const pId = this.route.snapshot.paramMap.get('id');

    if(pId){
      this.productService.getProductById(pId).subscribe({
        next: (data) => {
          this.product = data;

          if (this.userId && this.product) {
            this.productService.getMyFavourites(this.userId).subscribe({
              next: (favIds: string[]) => {
                this.product = {
                  ...this.product,
                  isFavourite: favIds.includes(pId)
                };
                this.cdr.detectChanges();
              },
              error: (e: any) => {
                console.error('fail to load data:', e);
                this.cdr.detectChanges();
              }
            });
          }else{
            this.product.isFavourite = false;
            this.cdr.detectChanges();
          }
        },
        error: (e) => console.log('fail : ', e)
      })
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  setFav(event: Event, product: any){
    event.stopPropagation();

    if (!this.userId) {
      this.alertService.showLoginRequired('Please log in to add new product!');
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
}
