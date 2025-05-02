import { Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth.guard.service";
import { RoleGuardService } from "src/app/services/role.guard.service";
import { MembersListComponent } from "./members-list/members-list.component";
import { NewMemberComponent } from "./new-member/new-member.component";
import { UpdateMemberComponent } from "./update-member/update-member.component";

export const membersRoutes: Routes = [
  {
    path: "library/members",
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ["owner"] },
    children: [
      {
        path: "list",
        component: MembersListComponent,
      },
      {
        path: "add-member",
        component: NewMemberComponent,
      },
      {
        path: ":userId/edit",
        component: UpdateMemberComponent,
      },
    ],
  },
];

// export const ownerRoutes: Routes = [
//   {
//     path: "library",
//     canActivate: [AuthGuardService, RoleGuardService],
//     data: { roles: ["owner"] },
//     children: [
//       // default redirect when you hit /owner-panel/library
//       // list all books at /owner-panel/library/books
//       { path: "books", component: BooksListComponent },

//       // add new book at
//       { path: "new-book", component: NewBookComponent },

//       // edit an existing book at
//       { path: ":bookId/edit", component: UpdateBookComponent },
//     ],
//   },
// ];
