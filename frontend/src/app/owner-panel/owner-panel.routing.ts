import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../services/auth.guard.service";
import { RoleGuardService } from "../services/role.guard.service";

import { BooksListComponent } from "./books/books-list/books-list.component";

import { UpdateBookComponent } from "./books/update-book/update-book.component";
import { NewBookComponent } from "./books/new-book/new-book.component";

export const ownerRoutes: Routes = [
  {
    path: "library",
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ["owner"] },
    children: [
      // default redirect when you hit /owner-panel/library
      // list all books at /owner-panel/library/books
      { path: "books", component: BooksListComponent },

      // add new book at
      { path: "new-book", component: NewBookComponent },

      // edit an existing book at
      { path: ":bookId/edit", component: UpdateBookComponent },
    ],
  },
];
