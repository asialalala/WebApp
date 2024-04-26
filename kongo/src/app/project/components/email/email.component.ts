import { Component } from "@angular/core";

@Component({
    selector: 'email',
    templateUrl:"./email.component.html"
})
export class MailComponent{
    email = "";

    onKeyUp()
    {
        console.log(this.email); // write on console
    }

}