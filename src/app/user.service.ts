import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';
import {Router} from '@angular/router';

// where we create our new methods
@Injectable()
export class UserService {

  // connecting to aws backend url
  url ='http://rentbackend2-env.zv5a2px8pe.us-east-2.elasticbeanstalk.com';

  // path for images
  path = 'http://rentbackend2-env.zv5a2px8pe.us-east-2.elasticbeanstalk.com/uploads/';

  tokenTimer: any;

// observable subjects, pass the results from our database

  isAdmin = new Subject();

  // set behavior authentication to false at first
  authenticated = new BehaviorSubject(false);

  selectedCars = new Subject();

  constructor(private http: HttpClient, private router: Router) {
  }

  changeAdmin(data: any) {
    this.isAdmin.next(data);
}

  // Method is from register ts
  createUser(email: string, password: string) {
    const authData = {email: email, password: password};
    return this.http.post( this.url + '/api/user/signup', authData);
  }

  loginUser(email: string, password: string) {
    const authData = {email: email, password: password};
    // expecting to get back these resulyd
    return this.http.post<{token: string, expiresIn: any, admin: any}>( this.url + '/api/user/login', authData);
}

setTimer(duration: any) {
  // logout the user after an hour has passed
  this.tokenTimer = setTimeout(() => {this.onLogout()}, duration * 1000);
}

saveuserData(token: string, expiration: Date, admin: any) {
  localStorage.setItem('token', token);
  localStorage.setItem('expiration', expiration.toString());
  localStorage.setItem('admin', admin);
}

onLogout() {
  this.authenticated.next(false);
  clearTimeout(this.tokenTimer);
  this.changeAdmin(0);
  localStorage.removeAll();
  this.router.navigate(['']);
}

getuserData() {
  const token = localStorage.getItem('token');
  const expiration =  localStorage.getItem('expiration');
  const admin = localStorage.getItem('admin');
  if (!token || !expiration) {
      return;
  }
  return {
      token: token,
      expirationDate: new Date(expiration),
      admin: admin
  };
}

// post request to search for dates from to until then pass data
// call it from datepicker.ts
getCars(from: any, until: any) {
  //pass data into endpoint
  const data = {from: from, until: until};
  return this.http.post( this.url + '/api/admin/cars', data);
}

//rend car - expecting id of car
rentCar(id: any, from: any, until: any, fromDate: any, untilDate: any) {
  // observable, post request. pass some data into this request
  const rentInfo = {id: id, from: from, until: until, fromDate: fromDate, untilDate: untilDate};
  return this.http.post( this.url + '/api/admin/rent', rentInfo);
}

}

