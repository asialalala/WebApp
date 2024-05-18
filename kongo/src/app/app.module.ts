import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BasicComponent } from '../tutorial/basic.component';
import { BookingComponent } from '../project/components/booking/booking.component';
import { InsertHotelTypesService } from '../tutorial/insertHotelTypes.service';
import { MailComponent } from '../project/components/email/email.component';
import { DisplayBookingsComponent } from '../display-bookings/display-bookings.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    AppComponent,
    BasicComponent,
    BookingComponent,
    MailComponent,
    DisplayBookingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [
    provideClientHydration(),
    InsertHotelTypesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
