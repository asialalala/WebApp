import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BookRoomComponent } from './bookRoom/bookRoom.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kongo';
  @ViewChild("alertContainer", { read: ViewContainerRef }) container: any;
  componentRef: any;
  constructor(private resolver: ComponentFactoryResolver) { }

  createComponent() {
    if (this.container) {
      this.container.clear();
      const factory: ComponentFactory<BookRoomComponent> = this.resolver.resolveComponentFactory(BookRoomComponent);
      this.componentRef = this.container.createComponent(factory);
    } else {
      console.error('Container is not defined');
    }
  }

}
