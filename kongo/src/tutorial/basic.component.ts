import { NgFor } from "@angular/common";
import { Component } from "@angular/core";
import { InsertHotelTypesService } from "./insertHotelTypes.service";

@Component({
    selector: 'basic',
    templateUrl: "./basic.component.html" 
})
export class BasicComponent {
    service = "Room reservation";
    types;

    constructor(service: InsertHotelTypesService) {
        this.types = service.getTypes();
    }
}