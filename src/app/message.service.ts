import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  
  private apiUrl = 'http://localhost:3000/api/message'; // 백엔드 주소
  constructor(private http: HttpClient) {}
  
  sendMessage(newMessage:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/send`, newMessage);
  }
  selectUserMessage(product_id:string, sender_id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/getUserMessage`,{
      params: {
      product_id: product_id,
      sender_id: sender_id
    }});
  }
  selectOwnerMessage(product_id:string, receiver_id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/getOwnerMessage`,{
      params: {
      product_id: product_id,
      sender_id: receiver_id
    }});
  }
  
}