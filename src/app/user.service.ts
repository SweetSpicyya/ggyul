import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User,LoginResponse } from './user.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  private apiUrl = 'http://localhost:3000/api/user'; // 백엔드 주소
  
  private loginStatus = new BehaviorSubject<boolean>(!!localStorage.getItem('loginUserData'));
  // save login data
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
  

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('loginUserData');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }


  // call this function when the login success
  setLoginUser(userData: any) {
    localStorage.setItem('loginUserData', JSON.stringify(userData));
    this.currentUserSubject.next(userData); // 📢 구독 중인 모든 곳에 알림!
  }

  // call this function when the logout
  logout() {
    localStorage.removeItem('loginUserData');
    this.currentUserSubject.next(null);
  }

  // want to get recent login user data (Snapshot)
  getCurrentUserValue() {
    return this.currentUserSubject.value;
  }

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