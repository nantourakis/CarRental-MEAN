import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../admin.service';
import { NgForm } from '@angular/forms'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-car',
  templateUrl: './create-car.component.html',
  styleUrls: ['./create-car.component.css']
})
export class CreateCarComponent implements OnInit, OnDestroy {

  // connecting to aws backend url
  url ='http://rentbackend2-env.zv5a2px8pe.us-east-2.elasticbeanstalk.com';

  selectedFile: File = null;
  fd = new FormData();
  // new observable (Subject)
  private unsubscribe = new Subject;

  // in order to send a request in our constrctor, we must set up our httpClient, now adminservice is an instance of our service aswell
  constructor(private http: HttpClient, private adminservice: AdminService) { }

  ngOnInit() {
  }

  // add methods from html event listeners
  onFileSelected(event) {
    //console.log(event.target.files[0]);
    this.selectedFile = <File>event.target.files[0];
    this.fd.append('file', this.selectedFile, this.selectedFile.name);
    // to send our angular request, create endpoint for node and then must subscribe for angular to send the request. takeUntil is an rxjs operator
    this.http.post( this.url + '/api/admin/save-image', this.fd).pipe(takeUntil(this.unsubscribe)).subscribe(res => console.log(res));
  }

  // call this method when the component is destroyed to unsubscribe and to help avoid memory leaks
  ngOnDestroy() {
    this.unsubscribe.unsubscribe();
  }

    // this onCreate method is from create-car.html / createCare is from admin.service.ts
    // on create takes a form - ngform - get the inputs
    onCreate(form: NgForm) {
      // to acess filename
      const filename = this.selectedFile.name
      // we save the subscribtion to a subject when we unsubscribe
      this.adminservice.createCar(form.value.brand, form.value.model, form.value.power, form.value.seats, filename).pipe(takeUntil(this.unsubscribe)).subscribe(res => console.log(res));
      // reset form after submition
      form.resetForm();
    }

}
