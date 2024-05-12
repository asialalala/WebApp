import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-display-bookings',
  templateUrl: './display-bookings.component.html',
  styleUrl: './display-bookings.component.css'
})
export class DisplayBookingsComponent implements OnInit {
  inputValue: string = '';
  message: string = '';
  bookings: any[] = [];
  email = "a.kruk@gmail.com";
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getItems();
  }

  showMessage(): void {
    this.message = this.inputValue;
  }

  getItems(): void {
    console.log("Tying to connect!");
    const params = new HttpParams().set('mail', this.email);
    this.http.get<any[]>('http://localhost:4000/booking', { params } ).subscribe({
      next: (response) => {
        this.bookings = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onKeyUp()
  {
      console.log(this.email); // write on console
  }
}
