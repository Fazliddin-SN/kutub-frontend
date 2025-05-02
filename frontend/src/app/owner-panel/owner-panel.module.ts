import { NgModule } from "@angular/core";
import { CommonModule, DatePipe, NgFor, NgIf } from "@angular/common";

import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";
import { BooksListComponent } from "./books/books-list/books-list.component";
import { RouterModule } from "@angular/router";
import { ownerRoutes } from "./owner-panel.routing";
import { NewBookComponent } from "./books/new-book/new-book.component";
import { UpdateBookComponent } from "./books/update-book/update-book.component";
@NgModule({
  declarations: [NewBookComponent, UpdateBookComponent, BooksListComponent],
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    RouterModule.forChild(ownerRoutes),
    NgIf,
    NgFor,
    MaterialModule,
  ],
})
export class OwnerPanelModule {}
