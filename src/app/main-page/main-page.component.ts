import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {

  cars: any;
  path: any;

  private unsubscribe = new Subject();

  // inject our userservice & MatDialog. component inside another component
  constructor(private userservice: UserService, private dialog: MatDialog ) { }

  ngOnInit() {
    // when the component initializes, call the below
    // subscribe to observable in order to get values 
    this.userservice.selectedCars.pipe(takeUntil(this.unsubscribe)).subscribe(res => {
    this.cars = res;
    this.path = this.userservice.path;
    });
  }

  // from html, onRent method. we expect to get back cars so pass car in
  onRent(car) {
    const from = localStorage.getItem('from');
    const until = localStorage.getItem('until');
    // save/convert date range to integers in our database
    const fromDate = moment(from).format('YYYY-MM-DD');
    const untilDate = moment(until).format('YYYY-MM-DD');
    // send our angular request, implement logic into server. pass subscribe in order to send request, expecting a result back
    this.userservice.rentCar(car._id, from, until, fromDate, untilDate).pipe(takeUntil(this.unsubscribe)).subscribe(res => console.log(res));

    // popup window with a width of 300px
    this.dialog.open(DialogOverviewExampleDialog, {
      width: '300px',
  });
  }

  ngOnDestroy() {
    this.unsubscribe.unsubscribe();
 }
}

//creating a new ts file
@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
//angular material
export class DialogOverviewExampleDialog {

  constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data: {}) {}

      // closes our popup window
  onNoClick(): void {
      this.dialogRef.close();
  }

}
