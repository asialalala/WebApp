import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-bookings',
  templateUrl: './display-bookings.component.html',
  styleUrl: './display-bookings.component.css'
})
export class DisplayBookingsComponent implements OnInit {
  inputValue: string = '';
  message: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

  showMessage(): void {
    this.message = this.inputValue;
  }
}
