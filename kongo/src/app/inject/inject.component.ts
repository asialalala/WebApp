import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-inject',
  templateUrl: './inject.component.html',
  styleUrl: './inject.component.css'
})
export class InjectComponent {
  input: string = "";
  rows: Rows[] = [];


  constructor(private http: HttpClient, private fb: FormBuilder) {
  }

  onSubmit(): void {
    console.log(this.input);
    const params = new HttpParams().set('input', this.input);
    this.http.get<Rows[]>('/api/injection', { params }).subscribe({
      next: (response) => {
        this.rows = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
};

interface Rows {
  a: number;
  b: number;
}