import { Routes } from "@angular/router";
import { AuthGuardService } from "../services/auth.guard.service";
import { RoleGuardService } from "../services/role.guard.service";
import { UserRegistrationComponent } from "./user-registration/user-registration.component";
import { LibraryOwnerComponent } from "./library-register/library-owner.component";

export const adminRoutes: Routes = [
  {
    path: "",
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ["admin"] },
    children: [
      {
        path: "add-user",
        component: UserRegistrationComponent,
      },
      {
        path: "add-lib",
        component: LibraryOwnerComponent,
      },
    ],
  },
];
