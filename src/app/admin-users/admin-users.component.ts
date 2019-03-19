import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { MatTableDataSource, MatPaginator, MatTable } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})

// also implement onDestroy, this is called when componenet is destroyed
export class AdminUsersComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  //implementing mat-table from html
  displayedColumns = ['email', 'isAdmin', 'edit'];
  // datasourcefrom angular material
  dataSource = new MatTableDataSource();
  users: any;

  // for pagination to work, importing from parent so child can use. name is paginator and table. passing through any data in table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('table') table: MatTable<any>;


  // inject service into constructor
  constructor(private adminservice : AdminService) { }

  //how to fetch data from database and put data into datasource / display to mat table
  ngOnInit() {
    this.adminservice.getUsers().pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      
      const ELEMENT_DATA = [];
      this.users = res;
      //loop through users
      this.users.forEach(user => {
        const email = user.email;
        const isAdmin = user.isAdmin;
        ELEMENT_DATA.push({email: email, isAdmin: isAdmin});
      });
      this.dataSource.data = ELEMENT_DATA;
      this.dataSource.paginator = this.paginator;
      console.log(ELEMENT_DATA);
    });
  }

  //Delete method/logic - passed into admin-user html(element) & add to/from admin.service.ts
  onDelete(element: any) {
    this.adminservice.deleteUser(element.email).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      const ELEMENT_DATA = [];
      this.users = res;
      //loop through users
      this.users.forEach(user => {
        const email = user.email;
        const isAdmin = user.isAdmin;
        // push values to table
        ELEMENT_DATA.push({email: email, isAdmin: isAdmin});
      });
      this.dataSource.data = ELEMENT_DATA;
      this.dataSource.paginator = this.paginator;
    });
  }

  // make user admin logic
  onAdmin(element: any) {
    this.adminservice.makeAdmin(element.email).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      const ELEMENT_DATA = [];
      this.users = res;
      //loop through users
      this.users.forEach(user => {
        const email = user.email;
        const isAdmin = user.isAdmin;
        ELEMENT_DATA.push({email: email, isAdmin: isAdmin});
      });
      this.dataSource.data = ELEMENT_DATA;
      this.dataSource.paginator = this.paginator;
    });
  }

  // remove subscription to avoid memory leaks. destroy subscription when component is destroyed
  ngOnDestroy() {
    this.unsubscribe.unsubscribe();
  }
}
