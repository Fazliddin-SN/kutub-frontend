import { NgModule } from "@angular/core";
import { MembersListComponent } from "./members-list/members-list.component";
import { UpdateMemberComponent } from "./update-member/update-member.component";
import { NewMemberComponent } from "./new-member/new-member.component";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/app.module";
import { membersRoutes } from "./lib-members.routing";
import { RouterModule } from "@angular/router";
@NgModule({
  declarations: [
    MembersListComponent,
    UpdateMemberComponent,
    NewMemberComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MaterialModule,
    RouterModule.forChild(membersRoutes),
  ],
})
export class LibMembersModule {}
