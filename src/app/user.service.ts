import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user'; // 백엔드 주소

  constructor(private http: HttpClient) { }

  // 유저 목록 가져오기
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}