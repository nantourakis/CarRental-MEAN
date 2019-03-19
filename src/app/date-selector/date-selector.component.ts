import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { UserService } from '../user.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  // inject our service into our constructor. instance of our service
  constructor(private userservice: UserService) { }

  ngOnInit() {
  }

  //method from date html, dealing with a form, NgForm
  onSearch(form: NgForm) {
    // to get time stamp, 0 is the from date
    const from0 = form.value.dateInput[0];
    // 1 is the until date
    const until0 = form.value.dateInput[1];
    //moment library - convert values to this format
    const from = moment(from0).format('YYYYMMDD');
    const until = moment(until0).format('YYYYMMDD');
    // save to local storage
    localStorage.setItem('from', from);
    localStorage.setItem('until', until);
    // call our method from user.service and pass our two valuse from and until / pass into our reservable "next", our result
    this.userservice.getCars(from, until).pipe(takeUntil(this.unsubscribe)).subscribe(res => this.userservice.selectedCars.next(res));
  }

  ngOnDestroy() {
    this.unsubscribe.unsubscribe();
  }

}
