// @Component({
//   selector: 'bookRoom',
//   templateUrl: './bookRoom.component.html',
//   styleUrl: './bookRoom.component.css'
// })
// export class BookRoomComponent {
//   firstName: string = "";
//   lastName: string = "";
//   mail: string = "";
//   phone: string = "";
// }

import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, DestroyRef, Input, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";



@Component({
  selector: "alert",
  templateUrl: './bookRoom.component.html',
  styleUrl: './bookRoom.component.css'
})
export class BookRoomComponent implements OnInit {
  bookingForm: FormGroup;
  @Input() bookingRooms: number[] = [];
  @Input() startDate: Date = new Date();
  @Input() endDate: Date = new Date();
  @Input() componentRef: any;
  customers: number[] = [];
  msg = "";

  private destroyRef = inject(DestroyRef);

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: ['']
    });
  }
  ngOnInit(): void { }

  onSubmit(): void {
    console.log(this.bookingForm.value);
    console.log("Rooms", this.bookingRooms.length);
    console.log("Since ", this.startDate, " until ", this.endDate);
    this.msg = "Booking...";

    //this.getSpecyficCustomer()
    let cutomerNum = this.customers.length;
    console.log("Ilosc takich customerow: ",  cutomerNum)
    if (cutomerNum <= 0) {
      this.addCustomer();
    }

    // add booking, create endpoint
    this.componentRef.destroy();

  }

  addCustomer(): void {
    console.log("Trying to add customer!");
    const url = `/api/customer`;

    // Use parameters in query body
    const body = {
      firstName: this.bookingForm.value.firstName,
      lastName: this.bookingForm.value.lastName,
      email: this.bookingForm.value.email,
      phoneNumber: this.bookingForm.value.phoneNumber
    };

    this.http.put<any>(url, body).subscribe({
      next: (response) => {
        console.log('Customer added successful:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  getSpecyficCustomer(): void {
    console.log("Trying to connect!");
    const params = new HttpParams().set('firstName', this.bookingForm.value.firstName).set('lastName', this.bookingForm.value.lastName).set('mail', this.bookingForm.value.mail);
    this.http.get<any>('/api/find', { params }).subscribe({
      next: (response) => {
        this.customers = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
