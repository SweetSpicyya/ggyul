import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private router:Router
  ){}
  ngOnInit(){
    this.getLoginData();
  }

  getLoginData(){
    const loginData = localStorage.getItem('loginUserData');
    console.log('loginData : '+loginData); 
  }
}
