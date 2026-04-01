import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register-user',
  imports: [FormsModule],
  templateUrl: './register-user.html',
  styleUrl: './register-user.css',
})
export class RegisterUser {
  constructor(private userService: UserService) {}
  userList: any[] = [];
  
  firstName:string = '';
  lastName:string = '';
  email:string='';
  password:string = '';
  confirmPw:string = '';
  birthday:string = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.userList = data;
        console.log('가져온 유저 데이터:', this.userList);
      },
      error: (err) => {
        console.error('데이터 로딩 실패:', err);
      }
    });
  }
  doRegister(){
    console.log('click the register button');
    if(this.validateRegistData()){
      
    };
  }
  
  validateRegistData() : boolean{
    console.log(`${this.firstName} ${this.lastName}, ${this.email}, ${this.password}, ${this.confirmPw}, ${this.birthday}`);
    if(!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPw || !this.birthday){
      alert('fill all the information');
      return false;
    } else if(this.firstName.length < 2 || this.lastName.length < 2){
      alert("first and last name must be at least 2 characters long");
      return false;
    } else if(!this.validateEmail()){
      alert("check your email format");
      return false;
    } else if(this.password != this.confirmPw){
      alert("Check your password again.");
      return false;
    } else if(!this.validatePassword()){
      alert("Password must contain Letters, Numbers, A character that is neither a letter nor a number and at least 6 characters.");
      return false;
    }  
    return true;
  }
  validateEmail():boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email); 
  };
  validatePassword():boolean{
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,}$/;
    return pwRegex.test(this.password);
  };
  validateTaken():boolean{
    
    return true;
  }
}
