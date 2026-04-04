import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-user',
  imports: [RouterLink,DatePipe],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.css',
})
export class ProfileUser {

  loginUser:any = null;
  ngOnInit(){
    this.getLoginData();
  }
  getLoginData(){
    const loginData = localStorage.getItem('loginUserData');
    
    if(loginData){
     this.loginUser = JSON.parse(loginData);
      console.log(`loginUser : ${this.loginUser._id}, ${this.loginUser.email}, ${this.loginUser.first_name}`); 
      // this.loginYn = true;
    } else { 
      // this.loginYn = false;
      this.loginUser = null;
    }
  }
}
