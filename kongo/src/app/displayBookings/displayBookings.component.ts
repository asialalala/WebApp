import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'appDisplayBookings',
  templateUrl: './displayBookings.component.html',
  styleUrls: ['./displayBookings.component.css']
})
export class DisplayBookingsComponent {
  inputValue: string = '';
  bookings: Booking[] = [];
  email: string = '';
  lastBooking: number = 0;
  oneBooking = true;

  constructor(private http: HttpClient) { }
  
  showMessage(): void {
    this.email = this.inputValue;
    this.getItems();
  }

  updateLastBooking(booingId: number): void {
    console.log("Update ", this.lastBooking, " on ", booingId )
    this.lastBooking = booingId;
  }

  onCancel(bookingId: number): void {
    this.cancelBooking(bookingId);
    this.getItems();
  }

  getItems(): void {
    console.log("Tying to connect!");
    const params = new HttpParams().set('mail', this.email);
    this.http.get<Booking[]>('/api/booking', { params }).subscribe({
      next: (response) => {
        this.bookings = response;
        console.log(this.bookings);
        this.lastBooking = this.bookings[0].booking_id;
        this.oneBooking = true;
        for (let i = 0; i < this.bookings.length; i++) {
          if (this.bookings[i].booking_id !== this.lastBooking) {
            this.oneBooking = false;
            this.lastBooking = this.bookings[i].booking_id;
            break; 
          }
        }
        this.lastBooking = 0;

        console.log(this.bookings[0].validation);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  cancelBooking(bookingId: number): void {
    console.log("Trying to cancel!");
    console.log(bookingId);
    const url = `/api/canceling/${bookingId}`;
    this.http.put<any>(url, {}).subscribe({
      next: (response) => {
        console.log('Canceled successful:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
  
}

// Definiowanie interfejsu Booking
interface Booking {
  booking_id: number,
  start_date: string;
  end_date: string;
  validation: boolean;
  queen_bed_num: number;
  single_bed_num: number;
  mail: string;
}

