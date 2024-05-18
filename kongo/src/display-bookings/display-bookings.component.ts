import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-display-bookings',
  templateUrl: './display-bookings.component.html',
  styleUrls: ['./display-bookings.component.css']
})
export class DisplayBookingsComponent implements OnInit {
  inputValue: string = '';
  bookings: Booking[] = [];
  email: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Możemy zainicjować dane tutaj, jeśli potrzebujemy
  }

  showMessage(): void {
    this.email = this.inputValue;
    this.getItems();
  }

  getItems(): void {
    console.log("Tying to connect!");
    const params = new HttpParams().set('mail', this.email);
    this.http.get<Booking[]>('/api/booking', { params }).subscribe({
      next: (response) => {
        this.bookings = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}

// Definiowanie interfejsu Booking
interface Booking {
  start_date: string;
  end_date: string;
  valid: boolean;
  queen_bed_num: number;
  single_bed_num: number;
  mail: string;
}
