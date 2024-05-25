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

import { Component, Input } from "@angular/core";



@Component({
  selector: "alert",
  templateUrl: './bookRoom.component.html',
  styleUrl: './bookRoom.component.css'
})
export class BookRoomComponent {
  @Input() type: string = "success";
  firstName: string = "";
  lastName: string = "";
  mail: string = "";
  phone: string = "";
}
