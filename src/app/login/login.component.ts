import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {UserService} from '../user.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    token: any;

    constructor(private userservice: UserService, private router: Router) {}

    //Login Logic
onlogin(form: NgForm) {
    // take email/password value from user input form
    const email = form.value.email;
    const password = form.value.password;
    // send results to our node server
        this.userservice.loginUser(email, password).subscribe(result => {
            this.userservice.authenticated.next(true);
           const admin = result.admin;
           const token = result.token;
           // save isAdmin to an observable
           this.userservice.isAdmin.next(admin);
           // get time from node
               const expires = result.expiresIn;
               if (token) {
                   this.userservice.setTimer(expires);
                   const now = new Date();
                   const expirationDate = new Date(now.getTime() + expires * 1000);
                   // save user date
                   this.userservice.saveuserData(token, expirationDate, admin);
                   this.router.navigate(['/main']);
        
               }
        });
}

autoAuthUser() {
    const authinfo = this.userservice.getuserData();
    if (!authinfo) {
        return;
    }
    const now = new Date();
    const expiresIn = authinfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
        this.token = authinfo.token;
        this.userservice.authenticated.next(true);
    }
}

}

