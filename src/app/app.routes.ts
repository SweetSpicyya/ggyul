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
import { MessageUser } from './message-user/message-user';


export const routes: Routes = [
  {path: '', redirectTo:'/home', pathMatch:'full'},
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
  {path: 'profileUser/:userId', component:ProfileUser},
  {path: 'messageUser', component:MessageUser},
  {path: '**', redirectTo: 'home'}
];
