// we create our methods in our services here
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AdminService {
  
  // connecting to aws backend url
  url ='http://rentbackend2-env.zv5a2px8pe.us-east-2.elasticbeanstalk.com';

  constructor(private http: HttpClient) { }

    createCar(brand: string, model: string, power: string, seats: any, imgUrl: string) {
      // a const to save data, what to send with post request and to Mongodb
      const carData = {brand: brand, model: model, power: power, seats: seats, imgUrl: imgUrl};
      return this.http.post( this.url + '/api/admin/create-car', carData);
    }

    //method to get users / endpoint - add to admin-users.ts
    getUsers() {
      return this.http.get( this.url + '/api/admin/users');
    }

    // Delete users based off email, sending to admin compenents (admin-user.component.ts) and node
    deleteUser(email: string) {
      const data = {email: email};
      return this.http.post( this.url + '/api/admin/delete-user', data);
    }

    // make a user an admin, 
    makeAdmin(email: string) {
      const userData = {email: email};
      return this.http.post( this.url + '/api/admin/admin-user', userData);
    }

    rentedCars() {
      // dont need to pass data in bc it's a Get request
      return this.http.get( this.url + '/api/admin/rented-cars');
    }

    cancelRent(id: any, from: any, until: any) {
      // pass data into post request
      const data = {id: id, from: from, until: until};
      return this.http.post( this.url + '/api/admin/cancel-rent', data);
    }
}
