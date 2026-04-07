import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
  product: any;
  userId = localStorage.getItem('user_id');

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
}
