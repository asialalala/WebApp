import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BasicComponent } from '../tutorial/basic.component';
import { BookingComponent } from '../project/components/booking/booking.component';
import { InsertHotelTypesService } from '../tutorial/insertHotelTypes.service';
import { MailComponent } from '../project/components/email/email.component';
import { DisplayBookingsComponent } from './display-bookings/display-bookings.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicComponent,
    BookingComponent,
    MailComponent,
    DisplayBookingsComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    InsertHotelTypesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
