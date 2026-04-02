import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User,LoginResponse } from './user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  private apiUrl = 'http://localhost:3000/api/user'; // 백엔드 주소

  constructor(private http: HttpClient) { }

  // 유저 목록 가져오기
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  registerUser(userData:User):Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  checkEmail(email:string):Observable<any>{
    return this.http.post(`${this.apiUrl}/emailCheck`, {email:email});
  }
  
  loginProcess(email:string, password:string):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {email:email, password:password});
  }
}