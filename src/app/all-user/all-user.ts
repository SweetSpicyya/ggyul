import { Component,ChangeDetectorRef ,HostListener} from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-user',
  imports: [CommonModule,DatePipe],
  templateUrl: './all-user.html',
  styleUrl: './all-user.css',
})
export class AllUser {
  constructor(
    private userService:UserService,
    private cdr : ChangeDetectorRef
  ){}

  filterParams:any={
    admin: '', 
    ageRange: '', 
    itemCount: 0,
    sortBy: 'first_name',
    order: 'asc'
  }
  getAllUserData:any[] =[];
  activeFilter: string = '';

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    if (!target.closest('.filter-wrapper')) {
      this.activeFilter = '';
    }
  }
  ngOnInit(){
    this.getAllData();
  }

  toggleFilter(filterName: string) {
    if (this.activeFilter === filterName) {
      this.activeFilter = ''; // 이미 열려있으면 닫기
    } else {
      this.activeFilter = filterName; // 해당 필터 열기
    }
  }

  closeFilter() {
    this.activeFilter = '';
  }

  setFilter(key: string, value: any) {
    this.filterParams[key] = value; 
    this.activeFilter = '';
    
    this.getAllData();
  }
  setSort(category:string){
    console.log('sort category : ' + category);
    this.filterParams.sortBy = category;
    this.filterParams.order = (this.filterParams.order === 'asc') ? 'desc' : 'asc';
    this.getAllData();
  }
  getAllData(){
    this.userService.getAllUserData(this.filterParams).subscribe({
      next:(res)=>{
        console.log('select all user data : '+JSON.stringify(res));
        
        this.getAllUserData = res.result || [];
        console.log('get user all data : ' + res.result);
        this.cdr.detectChanges();
      },
      error:(err)=> alert('get all user error')
    });
  }

  manageAdmin(user:any){
    console.log('manage Admin : ' + user._id + ", " + user.admin);
    const admin = user.admin=='ADMIN' ? 'USER' : 'ADMIN';
    console.log(user.admin + " to " + admin);
    this.userService.updateAdmin(user._id , admin ).subscribe({
      next:(res)=>{
        console.log('updated user data : ' + res.data);
        this.getAllData();
      },
      error:(err)=> alert('admin update error')
    })
  }
  deleteAccount(userId:string){
    console.log("delete account : "+userId);
    if (confirm('Really want to delete this user? 🍊')) {
      this.userService.deleteUserData(userId).subscribe({
        next: (res) => {
          alert('Account is deleted!');
          this.getAllData();
        },
        error: (err) => alert('삭제 실패: ' + err.message)
      });
    }
  }
}
