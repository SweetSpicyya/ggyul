import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { AlertService } from '../../../services/alert';
@Component({
  selector: 'app-header',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  loginYn:boolean = false;
  loginUser:any = null;
  constructor(
    private router:Router,
    private userService : UserService
  ){}
  private alertService = inject(AlertService);

  ngOnInit(){
    this.userService.currentUser$.subscribe({
      next:(user)=>{
        this.loginUser = user;
        this.loginYn = !!user; // if it has data = true, 
        console.log('login success : ' + user);
      },
      error:(err)=>{
        console.log('error get login data : ' + err);
      }
    })
  }

  // getLoginData(){
  //   const loginData = localStorage.getItem('loginUserData');
    
  //   if(loginData){
  //    this.loginUser = JSON.parse(loginData);
  //     console.log(`loginUser : ${this.loginUser._id}, ${this.loginUser.email}, ${this.loginUser.first_name}`); 
  //     // this.loginYn = true;
  //   } else { 
  //     // this.loginYn = false;
  //     this.loginUser = null;
  //   }
  // }
  doLogout(){
    this.userService.logout();
    // this.loginUser = null;
    // this.loginYn = false;
    // localStorage.removeItem('loginUserData');
    alert('“You have been logged out.”');
    this.router.navigate(['/home']);
  }

  gotoRequiredPage(path: string){
    if (!this.loginUser) {
      this.alertService.showLoginRequired('Please log in to add new product!');
      return;
    }

    this.router.navigate([path]);
  }
}
