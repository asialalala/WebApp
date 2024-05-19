import { Component } from '@angular/core';

@Component({
  selector: 'appFindRooms',
  templateUrl: './findRooms.component.html',
  styleUrl: './findRooms.component.css'
})
export class FindRoomsComponent {
  startDate: Date = new Date();
  endDate: Date = new Date();


  onFind(): void {
    const dayEnd: number = this.endDate.getDate();
    const monthEnd: number = this.endDate.getMonth() + 1; // Counting from 1
    const yearEnd: number = this.endDate.getFullYear();

    const dayStart: number = this.endDate.getDate();
    const monthStart: number = this.endDate.getMonth() + 1;
    const yearStart: number = this.endDate.getFullYear();

    // Create dring inf format"RRRR-MM-DD"
    const formattedEndDate: string = `${yearEnd}-${monthEnd.toString().padStart(2, '0')}-${dayEnd.toString().padStart(2, '0')}`;
    const formattedStartDate: string = `${yearStart}-${monthStart.toString().padStart(2, '0')}-${dayStart.toString().padStart(2, '0')}`;
    
    console.log(formattedEndDate);
    console.log(formattedStartDate);

  }
}

interface Room {
  room_id: number;
  queen_bed_num: number;
  single_bed_num: number;
  standard: string;
}
