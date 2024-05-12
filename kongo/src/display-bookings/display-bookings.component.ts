import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-display-bookings',
  templateUrl: './display-bookings.component.html',
  styleUrl: './display-bookings.component.css'
})
export class DisplayBookingsComponent implements OnInit {
  inputValue: string = '';
  message: string = '';
  bookings: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getItems();
  }

  showMessage(): void {
    this.message = this.inputValue;
  }

  getItems(): void {
    console.log("Tying to connect!");
    this.http.get<any[]>('http://localhost:4000/booking').subscribe({
      next: (response) => {
        this.bookings = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
