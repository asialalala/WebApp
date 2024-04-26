import { Component } from "@angular/core";

@Component({
    selector: 'bookingList',
    templateUrl:"./booking.component.html"
})
export class BookingComponent {
    bookings = [
        {id: 1, roomId: 1, floor: 0, state: "waiting"},
        {id: 2, roomId: 2, floor: 0, state: "waiting"},
        {id: 3, roomId: 3, floor: 1, state: "validated"}
    ];

    onAdd() {
        this.bookings.push({id: 4, roomId: 4, floor: 1, state: "waiting"});
    }

    onCancel(booking: { id: number; roomId: number; floor: number; state: string}) {
        let index = this.bookings.indexOf(booking);
        booking.state = "canceling...";
        // this.bookings.splice(index, 1); it removes
    }
}