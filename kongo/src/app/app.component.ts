import { Component, ComponentFactory, ComponentFactoryResolver, Inject, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kongo';
  currentComponent: string = '';

  showComponent(componentName: string) {
    this.currentComponent = componentName;
  }

}
