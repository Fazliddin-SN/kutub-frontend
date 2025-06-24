import { Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth.guard.service";

import { RentalsListComponent } from "./rentals-list/rentals-list.component";
import { NewRentalComponent } from "./new-rental/new-rental.component";
import { UpdateRentalComponent } from "./update-rental/update-rental.component";
import { RentalsHistoryComponent } from "./rentals-history/rentals-history.component";
import { RentalRequestsComponent } from "./rental-requests/rental-requests.component";
import { OwnerGuardService } from "src/app/services/role.guard.service";
import { OverdueRentalsComponent } from "./overdue-rentals/overdue-rentals.component";

export const rentalsRoute: Routes = [
  {
    path: "library/rentals",
    canActivate: [AuthGuardService, OwnerGuardService],
    data: { roles: ["owner"] },
    children: [
      {
        path: "list",
        component: RentalsListComponent,
      },
      {
        path: "add-rental",
        component: NewRentalComponent,
      },
      {
        path: ":rentalId/edit",
        component: NewRentalComponent,
      },
      {
        path: "history",
        component: RentalsHistoryComponent,
      },
      {
        path: "requests",
        component: RentalRequestsComponent,
      },
      {
        path: "overdues",
        component: OverdueRentalsComponent,
      },
    ],
  },
];
