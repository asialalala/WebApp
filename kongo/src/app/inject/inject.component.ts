import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-inject',
  templateUrl: './inject.component.html',
  styleUrl: './inject.component.css'
})
export class InjectComponent {
  input: string = "";

  constructor(private http: HttpClient, private fb: FormBuilder) {
  }

  onSubmit(): void {
    console.log(this.input);

    const url = `/api/injection`;

    // Use parameters in query body
    const body = {
      input: this.input
    };

    return;

    // Call addCustomer and chain bookRooms to it
    this.http.put<any>(url, body).subscribe({
      next: (response) => {
        console.log('Input submitted successful:', response);
      },
      error: (error) => {
        console.error('Error during submition:', error);
        // Handle the error as needed
      }
    });
  }
}
