import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule, MatInputModule, MatCardModule, MatToolbarModule, MatIconModule, 
MatButtonModule, MatSidenavModule, MatListModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ManageReservationsComponent } from './manage-reservations/manage-reservations.component';
import { CreateCarComponent } from './create-car/create-car.component';
import { MainPageComponent, DialogOverviewExampleDialog } from './main-page/main-page.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from './admin.service';
import { BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ManageReservationsComponent,
    CreateCarComponent,
    MainPageComponent,
    DateSelectorComponent,
    AdminUsersComponent,
    DialogOverviewExampleDialog
    // inside our componenet (main-page Component)
  ], entryComponents: [DialogOverviewExampleDialog],
  imports: [
    HttpClientModule,
    MatDialogModule,
    //forRoot so we can use in all of our components
    BsDatepickerModule.forRoot(),
    BrowserModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatCardModule,
    RouterModule.forRoot([
      {path: '', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'main', component: MainPageComponent},
      {path: 'create-car', component: CreateCarComponent},
      {path: 'manage', component: ManageReservationsComponent},
      {path: 'users', component: AdminUsersComponent}
    ])
  ],
  providers: [UserService, LoginComponent, AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }

