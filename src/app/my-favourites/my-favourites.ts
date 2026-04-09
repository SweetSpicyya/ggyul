import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert';

@Component({
  selector: 'app-my-favourites',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-favourites.html',
  styleUrl: './my-favourites.css',
  standalone: true,
})
export class MyFavourites implements OnInit {
  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private alertService = inject(AlertService);
  userId = JSON.parse(localStorage.getItem('loginUserData') || '{}')?._id;
  favList: any[] = [];

  conditionLabel: {[key: number]: string} = {
    0: '🌟 BNIB',
    1: '💎 Like New',
    2: '👍 Excellent',
    3: '👌 Good'
  };

  ngOnInit(){
    this.loadMyFavList();
  }

  loadMyFavList(){
    if(this.userId){
      this.productService.getMyFavList(this.userId).subscribe({
        next: (data) => {
          this.favList = data;
          this.cdr.detectChanges();
        },
        error: (e) => console.error('Fail to get data : ' + e)
      });
    }
  }


  removeFav(event: Event, productId: string){
    event.stopPropagation();

    if (!this.userId) {
      this.alertService.showLoginRequired('Please log in to remove this item from your favorites!');
      return;
    }

    this.productService.removeFavourite(productId, this.userId).subscribe({
      next: (res) => {
        this.loadMyFavList();
      },
      error: (err) => console.error('Fail to set Favourite:', err)
    });
  }


}
