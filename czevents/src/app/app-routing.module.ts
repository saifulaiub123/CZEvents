import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { EventpageComponent } from './eventpage/eventpage.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { EventeditComponent } from './eventedit/eventedit.component';
import { AddeventpageComponent } from './addeventpage/addeventpage.component';
import { EditbannerComponent } from './editbanner/editbanner.component';
import { AuthGuard } from './auth.guard';
import { FilteredEventsComponent } from './filtered-events/filtered-events.component';
import { LoginComponent } from './login/login.component';
import { BuyerComponent } from './buyer/buyer.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { RedirectToSectionAllGuard } from './redirect-to-section-all.guard';
import { PlaceorderComponent } from './placeorder/placeorder.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { GatewayComponent } from './gateway/gateway.component';
import { ProfileGuard } from './auth/profile.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Main',
    pathMatch: 'full',
  },
  {path:"Main", component: MainpageComponent},
  {path:"Buyer", component: BuyerComponent, canActivate: [RedirectToSectionAllGuard],},
  {path:"Organizer", component: OrganizerComponent},
  {path:"Event/:id", component: EventpageComponent},
  {path:"Order/:id", component: PlaceorderComponent},
  {path:"payment-gateway", component:GatewayComponent},
  {path:"Events/:type", component: FilteredEventsComponent},
  {path:"AdminLogin", component: AdminloginComponent},
  {path: "Login", component:LoginComponent},
  {path: "Profile", component: UserprofileComponent, canActivate: [ProfileGuard]},
  {path:"Admin", component: AdminpanelComponent, canActivate: [AuthGuard]},
  {path:"AdminEditEvent/:id", component: EventeditComponent, canActivate: [AuthGuard]},
  {path:"AddEventPage", component: AddeventpageComponent, canActivate: [AuthGuard]},
  {path:"EditSlides", component: EditbannerComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    enableTracing: false,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }




