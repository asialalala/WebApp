import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { BookRoomComponent } from '../bookRoom/bookRoom.component';

@Component({
  selector: 'appFindRooms',
  templateUrl: './findRooms.component.html',
  styleUrl: './findRooms.component.css'
})
export class FindRoomsComponent {
  startDate: Date = new Date();
  endDate: Date = new Date();
  rooms: Room[] = [];
  msg: string = "";
  bookingRooms: number[] = [];
  @ViewChild("alertContainer", { read: ViewContainerRef }) container: any;
  componentRef: any;

  constructor(private http: HttpClient, private resolver: ComponentFactoryResolver) { }

  createComponent() {
    if (this.container) {
      this.container.clear();
      const factory: ComponentFactory<BookRoomComponent> = this.resolver.resolveComponentFactory(BookRoomComponent);
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.bookingRooms = this.bookingRooms;
      this.componentRef.instance.startDate = this.startDate;
      this.componentRef.instance.endDate = this.endDate;
    } else {
      console.error('Container is not defined');
    }
  }

  onFind(): void {
    this.msg = ""
    this.rooms = [];
    if (this.startDate < this.endDate) {
      const dayStart: number = this.startDate.getDate();
      const monthStart: number = this.startDate.getMonth() + 1;
      const yearStart: number = this.startDate.getFullYear();

      const dayEnd: number = this.endDate.getDate();
      const monthEnd: number = this.endDate.getMonth() + 1; // Counting from 1
      const yearEnd: number = this.endDate.getFullYear();

      // Create string info format"RRRR-MM-DD"
      const formattedStartDate: string = `${yearStart}-${monthStart.toString().padStart(2, '0')}-${dayStart.toString().padStart(2, '0')}`;
      const formattedEndDate: string = `${yearEnd}-${monthEnd.toString().padStart(2, '0')}-${dayEnd.toString().padStart(2, '0')}`;


      console.log(formattedEndDate);
      console.log(formattedStartDate);

      this.getItems(formattedStartDate, formattedEndDate);
      console.log(this.rooms);
    }
    else {
      this.msg = "The start date can't be greater than end date ";
    }

  }

  getItems(start: string, end: string): void {
    console.log("Trying to connect!");
    const params = new HttpParams().set('startDate', start).set('endDate', end);
    this.http.get<Room[]>('/api/find', { params }).subscribe({
      next: (response) => {
        this.rooms = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onAddBook(roomId: number): void {
    console.log("Add to the booking room nr ", roomId);
    this.bookingRooms.push(roomId);
  }

  onBook(): void {
    console.log("Book");
    this.createComponent();
  }

}

interface Room {
  room_id: number;
  queen_bed_num: number;
  single_bed_num: number;
  standard: string;
}
