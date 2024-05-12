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
  items: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getItems();
  }

  showMessage(): void {
    this.message = this.inputValue;
  }

  getItems(): void {
    this.http.get<any[]>('/api/items').subscribe(
      (response) => {
        this.items = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
