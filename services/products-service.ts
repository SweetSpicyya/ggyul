import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  registerProduct(productData: any): Observable<any>{
    return this.http.post( `${this.apiUrl}/api/registerproduct`, productData);
  }

}
