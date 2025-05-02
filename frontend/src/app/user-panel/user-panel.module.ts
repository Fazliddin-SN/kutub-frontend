import { NgModule } from "@angular/core";
import { AvailableBooksComponent } from "./available-books/available-books.component";
import { CommonModule, DatePipe, NgFor, NgIf } from "@angular/common";
import { MaterialModule } from "../app.module";

import { RouterModule } from "@angular/router";
import { simpleUserRoutes } from "./user-panel.routing";

@NgModule({
  declarations: [AvailableBooksComponent],
  imports: [
    CommonModule,
    DatePipe,
    NgIf,
    NgFor,
    MaterialModule,
    RouterModule.forChild(simpleUserRoutes),
  ],
})
export class userPanelModule {}
