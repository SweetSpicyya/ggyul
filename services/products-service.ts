import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/product/${id}`);
  }

  registerProduct(productData: any): Observable<any>{
    return this.http.post( `${this.apiUrl}/api/registerproduct`, productData);
  }

  updateProduct(id: string, data: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/api/updateproduct/${id}`, data);
  }

  setFavourite(productId: string): Observable<any>{
    const userId = localStorage.getItem('user_id');

    return this.http.post(`${this.apiUrl}/api/favourites`,{
      productId,
      userId
    })
  }

  getMyFavourites(userId: string): Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/favorites/${userId}`);
  }

  getFilteredProducts(params: any): Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/filter/products`,{
      params
    })
  }

}
