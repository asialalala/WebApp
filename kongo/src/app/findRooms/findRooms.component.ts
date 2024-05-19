import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'appFindRooms',
  templateUrl: './findRooms.component.html',
  styleUrl: './findRooms.component.css'
})
export class FindRoomsComponent {
  startDate: Date = new Date();
  endDate: Date = new Date();
  rooms: Room[] = [];
  constructor(private http: HttpClient) { }


  // TO DO verify if start date < end date
  onFind(): void {

    const dayStart: number = this.startDate.getDate();
    const monthStart: number = this.startDate.getMonth() + 1;
    const yearStart: number = this.startDate.getFullYear();

    const dayEnd: number = this.endDate.getDate();
    const monthEnd: number = this.endDate.getMonth() + 1; // Counting from 1
    const yearEnd: number = this.endDate.getFullYear();

    // Create dring inf format"RRRR-MM-DD"
    const formattedStartDate: string = `${yearStart}-${monthStart.toString().padStart(2, '0')}-${dayStart.toString().padStart(2, '0')}`;
    const formattedEndDate: string = `${yearEnd}-${monthEnd.toString().padStart(2, '0')}-${dayEnd.toString().padStart(2, '0')}`;
  
    
    console.log(formattedEndDate);
    console.log(formattedStartDate);

    this.getItems(formattedStartDate, formattedEndDate);
  
  }

  getItems(start: string, end: string): void {
    console.log("Tying to connect!");
    const params = new HttpParams().set('startDate', start).set('endDate', end);
    this.http.get<Room[]>('/api/find', { params }).subscribe({
      next: (response) => {
        this.rooms = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });

    console.log(this.rooms);
  }
}

interface Room {
  room_id: number;
  queen_bed_num: number;
  single_bed_num: number;
  standard: string;
}
