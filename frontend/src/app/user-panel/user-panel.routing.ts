import { Routes } from "@angular/router";
import { AuthGuardService } from "../services/auth.guard.service";

import { AvailableBooksComponent } from "./available-books/available-books.component";
import { MyReadBooksComponent } from "./my-read-books/my-read-books.component";

export const simpleUserRoutes: Routes = [
  {
    path: "",
    canActivate: [AuthGuardService],
    data: { roles: ["user"] },
    children: [
      {
        path: "available-books",
        component: AvailableBooksComponent,
      },
      {
        path: "read-books",
        component: MyReadBooksComponent,
      },
    ],
  },
];
