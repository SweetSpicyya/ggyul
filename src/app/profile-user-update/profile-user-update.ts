import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink} from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-user-update',
  imports: [DatePipe,RouterLink,FormsModule],
  templateUrl: './profile-user-update.html',
  styleUrl: './profile-user-update.css',
})
export class ProfileUserUpdate {
  userId:string | null ='';
  firstName:string='';
  lastName:string='';
  email:string='';
  admin:string='';
  password:string='';
  passwordConfirm:string='';
  birthDate:string='';

  loginUser:any = null;
  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private userService : UserService
  ){}
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    console.log('넘겨받은 ID:', this.userId);
    this.getLoginData();
  }
  
  getLoginData(){
    const loginData = localStorage.getItem('loginUserData');
    
    if(loginData){
     this.loginUser = JSON.parse(loginData);
      console.log(`loginUser : ${this.loginUser._id}, ${this.loginUser.email}, ${this.loginUser.first_name}`); 
      // this.loginYn = true;
      this.firstName=this.loginUser.first_name;
      this.lastName=this.loginUser.last_name;
      this.email=this.loginUser.email;
      if (this.loginUser.birth_date) {
        const fullDate = new Date(this.loginUser.birth_date);
        this.birthDate = fullDate.toISOString().split('T')[0];
      }
    } else { 
      // this.loginYn = false;
      this.loginUser = null;
    }
  }

  doSave(){
    if(!this.validateRegistData()) return;
    if(this.loginUser.email != this.email){
      this.userService.checkEmail(this.email).subscribe({
        next:(res)=>{
          console.log('email check : ', res);
          if(res.exists){
            this.callSave();
          } else {
            alert("this email is already taken.");
          }
        },
        error:(err)=>{
          alert("email check : err.message"+ err);
          console.error(err);
          return false;
        }
      })
    }
    this.callSave();
  }
  validateRegistData() : boolean{
    console.log(`${this.firstName} ${this.lastName}, ${this.email}, ${this.password}, ${this.passwordConfirm}, ${this.birthDate}`);
    if(!this.firstName || !this.lastName || !this.email || !this.birthDate){
      alert('fill all the information');
      return false;
    } else if(this.firstName.length < 2 || this.lastName.length < 2){
      alert("first and last name must be at least 2 characters long");
      return false;
    } else if(!this.validateEmail()){
      alert("check your email format");
      return false;
    } else if(this.password && this.password != this.passwordConfirm){
      alert("Check your password again.");
      return false;
    } else if(this.password && !this.validatePassword()){
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

  callSave(){
    const updatedData: User = {
      _id: this.userId ?? undefined, // 라우터에서 받아온 ID
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password || this.loginUser.password,
      birth_date: new Date(this.birthDate),
      admin: this.loginUser.admin
    };
    console.log(updatedData);
    this.userService.updateProfile(updatedData).subscribe({
      next: (res) => {
        
        const newData = {
          _id: updatedData._id,
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          email:updatedData.email,
          admin:updatedData.admin,
          birth_date:updatedData.birth_date
        };
        localStorage.setItem('loginUserData', JSON.stringify(newData));
        this.userService.updateLoginStatus(true);
        this.router.navigate(['/home']);
      },
      error: (err) => alert('update error!')
    })
  }
}
