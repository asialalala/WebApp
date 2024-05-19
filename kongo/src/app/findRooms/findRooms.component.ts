import { Component } from '@angular/core';

@Component({
  selector: 'appFindRooms',
  templateUrl: './findRooms.component.html',
  styleUrl: './findRooms.component.css'
})
export class FindRoomsComponent {
  startDate: Date = new Date();
  endDate: Date = new Date();
}

interface Room {
  room_id: number;
  queen_bed_num: number;
  single_bed_num: number;
  standard: string;
}
