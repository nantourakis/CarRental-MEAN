import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-manage-reservations',
  templateUrl: './manage-reservations.component.html',
  styleUrls: ['./manage-reservations.component.css']
})
export class ManageReservationsComponent implements OnInit {

  cars: any;

  displayedColumns: string[] = ['car_id', 'reserved_from', 'reserved_until', 'cancel'];
  // date to be displated to table
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // inject service in order to use it, from admin service
  constructor(private adminservice: AdminService) { }

  // when the component initializes, then these take place
  ngOnInit() {
    this.adminservice.rentedCars().subscribe(res => {
      // create an empyt table then loop/push results to table 
        const ELEMENT_DATA = [];
        this.cars = res;
        this.cars.forEach(car => {
            const id = car.car_id;
            const from = car.fromDate;
            const until = car.untilDate;
            ELEMENT_DATA.push({car_id: id, fromDate: from, untilDate: until});
        });
        this.dataSource.data = ELEMENT_DATA;
        this.dataSource.paginator = this.paginator;
    });
}

  onCancel(element: any) {
    // adminservice from admin.servic.ts, we expect to find the element
    this.adminservice.cancelRent(element.car_id, element.fromDate, element.untilDate).subscribe(res3 => {
      // also call the rented cars
      this.adminservice.rentedCars().subscribe(res3 => {
          const ELEMENT_DATA = [];
          this.cars = res3;
          this.cars.forEach(car => {
              const id = car.car_id;
              const from = car.fromDate;
              const until = car.untilDate;
              ELEMENT_DATA.push({car_id: id, fromDate: from, untilDate: until});
          });
          this.dataSource.data = ELEMENT_DATA;
          this.dataSource.paginator = this.paginator;
      });
     });
  }



}

