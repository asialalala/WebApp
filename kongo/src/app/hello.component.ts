import { NgFor } from "@angular/common";
import { Component } from "@angular/core";
import { HelloService } from "./hello.service";

@Component({
    selector: 'hello',
    // template: '<h2>{{"Service: " + service}}</h2>'
    template: `
        <!-- <h2>{{ getService() }}</h2> -->
        <h2>{{ service }}</h2>
        <ul>
            <li *ngFor="let type of types">
                {{type}}    
            </li>
            
        </ul>
        `
})
export class HelloComponent {
    service = "Room reservation";
    types;
    // getService() {
    //     return this.service;
    // }

    constructor(service: HelloService) {
        // let service = new HelloService();
        this.types = service.getTypes();
    }
}