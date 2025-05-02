import { Routes } from "@angular/router";
import { AuthGuardService } from "../services/auth.guard.service";
import { RoleGuardService } from "../services/role.guard.service";
import { AvailableBooksComponent } from "./available-books/available-books.component";

export const simpleUserRoutes: Routes = [
  {
    path: "",
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ["user"] },
    children: [
      {
        path: "available-books",
        component: AvailableBooksComponent,
      },
    ],
  },
];
