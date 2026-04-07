import { Component } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile-user',
  imports: [RouterLink,DatePipe],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.css',
})
export class ProfileUser {
  constructor(
    private userService : UserService,
    private router : Router
  ){}
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

  deleteAccount(userId:string){
    console.log("delete account : "+userId);
    if (confirm('Really want to delete this user? 🍊')) {
      this.userService.deleteUserData(userId).subscribe({
        next: (res) => {
          alert('Account is deleted!');
          localStorage.removeItem('loginUserData');
          this.userService.updateLoginStatus(false);
          this.router.navigate(['/home']);
        },
        error: (err) => alert('fail deleting account: ' + err.message)
      });
    }
  }
}
