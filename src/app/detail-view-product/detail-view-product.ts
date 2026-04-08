import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products-service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-view-product',
  imports: [CommonModule, RouterLink, FormsModule,DatePipe],
  templateUrl: './detail-view-product.html',
  styleUrl: './detail-view-product.css',
  standalone: true,
})
export class DetailViewProduct implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  product: any;
  userId = JSON.parse(localStorage.getItem('loginUserData') || '{}')?._id;
  loginUserData:any = null;
  productOwner:boolean = false;
  messageContent:string = '';
  messageData:any[] = [];
  ownerMessageData:any[] = [];

  ngOnInit() {
    const pId = this.route.snapshot.paramMap.get('id');

    if(pId){
      this.productService.getProductById(pId).subscribe({
        next: (data) => {
          this.product = data;
          if (this.userId && this.product) {
            this.productService.getMyFavourites(this.userId).subscribe({
              next: (favIds: string[]) => {
                this.product = {
                  ...this.product,
                  isFavourite: favIds.includes(pId)
                };
                // this.cdr.detectChanges();
                // this.checkUser();
                this.safeCheckUser();
              },
              error: (e: any) => {
                console.error('fail to load data:', e);
                // this.cdr.detectChanges();
                this.safeCheckUser();
              }
            });
          }else{
            this.product.isFavourite = false;
            // this.cdr.detectChanges();
            // this.checkUser();
            this.safeCheckUser();
          }
        },
        error: (e) => console.log('fail : ', e)
      })
    }

    this.userService.currentUser$.subscribe({
      next:(user)=>{
        this.loginUserData = user;
        this.checkUser();
        console.log('login success : ' + user);
      },
      error:(err)=>{
        console.log('error get login data : ' + err);
      }
    })


  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  setFav(event: Event, product: any){
    event.stopPropagation();

    if (!this.userId) {
      this.alertService.showLoginRequired('Please log in to add new product!');
      return;
    }

    this.productService.setFavourite(product._id, this.userId).subscribe({
      next: (res) => {
        product.isFavourite = res.isFavourite;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fail to set Favourite:', err)
    });
  }

  private safeCheckUser() {
    setTimeout(() => {
      this.checkUser();
      this.cdr.detectChanges();
    }, 0);
  }
  checkUser(){
    console.log("check login user data : " + JSON.stringify(this.loginUserData));
    console.log("check product data : " + JSON.stringify(this.product));
    if(!(this.loginUserData && this.product)){return;}

    if(this.loginUserData._id == this.product.user_id){
      this.productOwner = true;
      this.getOwnerMessageData();
      
    } else {
      this.productOwner=false;
      this.getUserMessageData();
    }
  }
  sendMessage(){
    console.log("click send message : " + JSON.stringify(this.loginUserData));
    console.log("click send message : " + JSON.stringify(this.product));
    if(!this.messageContent){
      alert('check the message');
      return;
    } 
    const messageData = {
      product_id : this.product._id,
      receiver_id : this.product.user_id,
      sender_id : this.loginUserData._id,
      creation_time : new Date(),
      content : this.messageContent
    }
    console.log('message data : ' + JSON.stringify(messageData));
    this.messageService.sendMessage(messageData).subscribe({
      next:(res)=>{
        console.log(res.id);
        this.messageContent = '';
        this.getUserMessageData();
      },
      error:(err)=>{
        alert('sending message fail');
        console.log(err);
      }
    })
  }
  getUserMessageData(){
    console.log('not a owener, login user');
    this.messageService.selectUserMessage(this.product._id, this.loginUserData._id).subscribe({
      next:(res)=>{
        console.log('get user send message '+res.result); 
        this.messageData = res.result; 
        this.cdr.detectChanges();
      },
      error:(err)=>{
        alert('get user message fail');
        console.log(err);
      }
    })
  }

  getOwnerMessageData(){
    console.log('im a owener, login user');
    this.messageService.selectOwnerMessage(this.product._id, this.loginUserData._id).subscribe({
      next:(res)=>{
        console.log('get user send message '+res.result); 
        this.ownerMessageData = res.result; 
        this.cdr.detectChanges();
      },
      error:(err)=>{
        alert('get user message fail');
        console.log(err);
      }
    })
  }
}
