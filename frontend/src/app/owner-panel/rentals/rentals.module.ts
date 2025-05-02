import { NgModule } from "@angular/core";
import { RentalsListComponent } from "./rentals-list/rentals-list.component";
import { NewRentalComponent } from "./new-rental/new-rental.component";
import { CommonModule, DatePipe, NgFor, NgIf } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/app.module";

import { rentalsRoute } from "./rentals.routing";
import { RouterModule } from "@angular/router";
import { UpdateRentalComponent } from "./update-rental/update-rental.component";
import { RentalsHistoryComponent } from "./rentals-history/rentals-history.component";
import { RentalRequestsComponent } from "./rental-requests/rental-requests.component";
@NgModule({
  declarations: [
    RentalsListComponent,
    NewRentalComponent,
    UpdateRentalComponent,
    RentalsHistoryComponent,
    RentalRequestsComponent,
  ],
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MaterialModule,
    RouterModule.forChild(rentalsRoute),
  ],
})
export class RentalsModule {}
