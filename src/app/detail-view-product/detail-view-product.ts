import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-detail-view-product',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './detail-view-product.html',
  styleUrl: './detail-view-product.css',
  standalone: true,
})
export class DetailViewProduct implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  product: any;
  userId = localStorage.getItem('user_id');
  loginUserData:any = null;
  productOwner:boolean = false;
  messageContent:string = '';
  messageData:any[] = [];

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
                this.cdr.detectChanges();
                this.checkUser();
              },
              error: (e: any) => {
                console.error('fail to load data:', e);
                this.cdr.detectChanges();
              }
            });
          }else{
            this.product.isFavourite = false;
            this.cdr.detectChanges();
            this.checkUser();
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
      Swal.fire({
        html: `
          <div style="font-size: 55px; margin-top: 5px;">🍊</div>
          <div class="swal2-title" style="margin-bottom: 10px;">Sign-in Required</div>
          <div class="swal2-html-container">Please log in to save your favorite items!</div>
        `,
        text: 'Please log in to add this item to your favorites!',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'swal2-confirm',
          cancelButton: 'swal2-cancel',
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container'
        },
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Maybe later',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/loginUser']);
        }
      });
      return;
    }

    this.productService.setFavourite(product._id).subscribe({
      next: (res) => {
        product.isFavourite = res.isFavourite;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fail to set Favourite:', err)
    });
  }
  checkUser(){
    console.log("check login user data : " + JSON.stringify(this.loginUserData));
    console.log("check product data : " + JSON.stringify(this.product));
    if(!(this.loginUserData && this.product)){return;}

    if(this.loginUserData._id == this.product.user_id){
      this.productOwner = true;
      
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
    this.messageService.selectOwnerMessage(this.product._id, this.loginUserData._id).subscribe({
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
}
