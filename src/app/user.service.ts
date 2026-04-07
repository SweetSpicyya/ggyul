import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User,LoginResponse } from './user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  private apiUrl = 'http://localhost:3000/api/user'; // 백엔드 주소
  
  private loginStatus = new BehaviorSubject<boolean>(!!localStorage.getItem('loginUserData'));
  isLoggedIn$ = this.loginStatus.asObservable();

  constructor(private http: HttpClient) { }

  updateLoginStatus(status:boolean){
    this.loginStatus.next(status);
  }
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
  updateProfile(userData:User):Observable<any>{
    return this.http.put(`${this.apiUrl}/updateProfile`, userData);
  }
  getAllUserData(params?: any):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/allUser`, {params:params});
  }
  updateAdmin(_id:string, admin:string):Observable<any>{
    return this.http.put(`${this.apiUrl}/updateAdmin`, {_id : _id , admin : admin});
  }
  deleteUserData(_id:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/userDelete`, {params:{_id : _id}});
  }
}