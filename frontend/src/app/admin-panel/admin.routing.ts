import { Routes } from "@angular/router";

import { UserRegistrationComponent } from "./user-registration/user-registration.component";
import { LibraryOwnerComponent } from "./library-register/library-owner.component";
import { EditProfileComponent } from "../pages/edit-profile/edit-profile.component";
import { AdminGuardService } from "../services/owner.guard.service";

export const adminRoutes: Routes = [
  {
    path: "",
    canActivate: [AdminGuardService],
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
