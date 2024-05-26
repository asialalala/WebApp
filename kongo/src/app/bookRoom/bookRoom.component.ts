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
  msg = "";

  private destroyRef = inject(DestroyRef);

  constructor(private fb: FormBuilder) {
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
    this.msg = "Successful booking";
    this.componentRef.destroy();
    
    //send data to endpoint
    // wait
    //delete component
  }
}
