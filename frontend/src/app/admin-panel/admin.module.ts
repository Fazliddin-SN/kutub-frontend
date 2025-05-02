import { NgModule } from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// your shared Material imports
import { adminRoutes } from "./admin.routing";

import { UserRegistrationComponent } from "./user-registration/user-registration.component";
import { LibraryOwnerComponent } from "./library-register/library-owner.component";
import { MaterialModule } from "../app.module";

@NgModule({
  declarations: [UserRegistrationComponent, LibraryOwnerComponent],
  imports: [
    CommonModule, // provides NgIf, NgFor, etc.
    ReactiveFormsModule, // provides [formGroup], formControlName, etc.
    RouterModule.forChild(adminRoutes), // your Angular Material wrapper module
    MaterialModule,
    NgIf,
  ],
})
export class AdminPanelModule {}
