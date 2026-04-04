import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-view-product',
  imports: [CommonModule],
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

  ngOnInit() {
    const pId = this.route.snapshot.paramMap.get('id');

    if(pId){
      this.productService.getProductById(pId).subscribe({
        next: (data) => {
          console.log(data);
          this.product = data;
          this.cdr.detectChanges();
        },
        error: (e) => console.log('fail : ', e)
      })

    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
