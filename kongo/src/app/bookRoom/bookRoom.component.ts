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

import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder,FormGroup } from "@angular/forms";



@Component({
  selector: "alert",
  templateUrl: './bookRoom.component.html',
  styleUrl: './bookRoom.component.css'
})
export class BookRoomComponent implements OnInit{
  bookingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: ['']
    });
  }
  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.bookingForm.value);
  }

  onConfirm(): void{
    // call end point to add every bookings
    // show message about confirmation
    // wait
    //delete component
  }
}
