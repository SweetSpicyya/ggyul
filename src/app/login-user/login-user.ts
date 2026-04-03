import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-login-user',
  imports: [FormsModule,RouterLink],
  templateUrl: './login-user.html',
  styleUrl: './login-user.css',
})
export class LoginUser {
  constructor(
    private userService:UserService,
    private router:Router
  ){}

  inputId:string='';
  inputPw:string='';

  doLogin(){
    console.log(`doLogin : ${this.inputId}, ${this.inputPw}`);
    if(!this.inputId || !this.inputPw){
      alert("check the input");
      return;
    }

    this.userService.loginProcess(this.inputId,this.inputPw).subscribe({
      next:(res)=>{
        console.log('login success',res);
        const loginDBData = res.loginData;
        if( ! res.success|| !loginDBData){
          alert('login fail');
          return ;
        }
        
        
        const loginUserData = {
          _id : loginDBData._id,
          email : loginDBData.email,
          first_name : loginDBData.first_name,
          last_name : loginDBData.last_name,
          birth_date : loginDBData.birth_date,
          admin : loginDBData.admin
        };
        
        localStorage.setItem('loginUserData', JSON.stringify(loginUserData));
        console.log("loginUserData : " + JSON.stringify(loginUserData));
        alert(`welcome ${res.loginData?.first_name}`);
        this.userService.updateLoginStatus(true);
        this.router.navigate(['home']);
      },
      error:(err)=>{
        alert("fail the login. try again.");
        console.log(err);
        return false;
      }
    })
  }

}
