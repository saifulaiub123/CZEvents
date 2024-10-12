import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

import { SlidesComponent } from './slides/slides.component';
import { InterfaceComponent } from './interface/interface.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { EventpageComponent } from './eventpage/eventpage.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { EventeditComponent } from './eventedit/eventedit.component';
import { AddeventpageComponent } from './addeventpage/addeventpage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditbannerComponent } from './editbanner/editbanner.component';
import { FilteredEventsComponent } from './filtered-events/filtered-events.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { FilternavComponent } from './filternav/filternav.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { LoginComponent } from './login/login.component';
import { BuyerComponent } from './buyer/buyer.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { PlaceorderComponent } from './placeorder/placeorder.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { GatewayComponent } from './gateway/gateway.component';
import { provideRouter, withHashLocation } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SlidesComponent,
    InterfaceComponent,
    MainpageComponent,
    EventpageComponent,
    AdminloginComponent,
    AdminpanelComponent,
    EventeditComponent,
    AddeventpageComponent,
    EditbannerComponent,
    FilteredEventsComponent,
    ContactFormComponent,
    FilternavComponent,
    DateRangeComponent,
    LoginComponent,
    BuyerComponent,
    OrganizerComponent,
    PlaceorderComponent,
    UserprofileComponent,
    GatewayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSliderModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
