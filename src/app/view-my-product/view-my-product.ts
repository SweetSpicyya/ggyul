import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../services/products-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-my-product',
  imports: [CommonModule, RouterModule],
  templateUrl: './view-my-product.html',
  styleUrl: './view-my-product.css',
  standalone: true,
})
export class ViewMyProduct implements OnInit {
  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  userId = JSON.parse(localStorage.getItem('loginUserData') || '{}')?._id;
  products: any[] = [];

  conditionLabel: {[key: number]: string} = {
    0: '🌟 BNIB',
    1: '💎 Like New',
    2: '👍 Excellent',
    3: '👌 Good'
  };

  ngOnInit(){
    this.loadMyProducts();
  }

  loadMyProducts(){
    if(this.userId){
      this.productService.getMyProducts(this.userId).subscribe({
        next: (data) => {
          this.products = data;
          this.cdr.detectChanges();
        },
        error: (e) => console.error('Fail to get data : ' + e)
      });
    }
  }

  deleteProduct(id: string) {
    Swal.fire({
      html: `
          <div class="swal2-orange-icon-greypulse">🍊</div>
          <div class="swal2-title" style="margin-bottom: 10px;">Are you sure?</div>
          <div class="swal2-html-container">You won't be able to revert this!</div>
        `,
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('yes delete');
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your product has been removed. 🍊',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              customClass: { popup: 'swal2-popup', title: 'swal2-title' }
            });
            this.loadMyProducts();
          },
          error: (err) => {
            Swal.fire('Error!', 'Failed to delete the product.', 'error');
          }
        });
      }
    });
  }
}
