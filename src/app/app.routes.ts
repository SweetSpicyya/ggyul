import { Routes } from '@angular/router';
import { NewProduct } from './new-product/new-product';
import { ViewMyProduct } from './view-my-product/view-my-product';
import { EditMyProduct } from './edit-my-product/edit-my-product';
import { DetailViewProduct } from './detail-view-product/detail-view-product';
import { MyFavourites } from './my-favourites/my-favourites';
import { Home } from './home/home';
import { AllUser } from './all-user/all-user';
import { LoginUser } from './login-user/login-user';
import { RegisterUser } from './register-user/register-user';
import { ProfileUser } from './profile-user/profile-user';
import { ProfileUserUpdate } from './profile-user-update/profile-user-update';
import { MessageUser } from './message-user/message-user';
import { Header } from './header/header';


export const routes: Routes = [
  {
    path:'',
    component:Header,
    children:[
      {path: '', component:Home},
      {path: 'home', component:Home},
      {path: 'newproduct', component: NewProduct},
      {path: 'viewMyProduct', component:ViewMyProduct},
      {path: 'editMyProduct/:id', component:EditMyProduct},
      {path: 'detailViewProduct/:id', component:DetailViewProduct},
      {path: 'myFavourites', component:MyFavourites},
      {path: 'allUser', component:AllUser},
      {path: 'loginUser', component:LoginUser},
      {path: 'registerUser', component:RegisterUser},
      {path: 'profileUser', component:ProfileUser},
      {path: 'editProfileUser/:userId', component:ProfileUserUpdate},
      {path: 'messageUser', component:MessageUser}
    ]
  }
  
];
