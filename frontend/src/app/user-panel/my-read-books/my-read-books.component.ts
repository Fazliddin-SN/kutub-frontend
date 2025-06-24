import { Component, inject, OnInit } from "@angular/core";
import { SimpleUserService } from "src/app/services/simple-user.service";

declare interface TableData {
  headerRow: string[];
}

@Component({
  selector: "app-my-read-books",
  templateUrl: "./my-read-books.component.html",
  styleUrls: ["./my-read-books.component.css"],
})
export class MyReadBooksComponent implements OnInit {
  private usersService = inject(SimpleUserService);

  readBooks: any[] = [];
  errorMessage: string;

  tableData1: TableData;

  // pagination
  currentPage: number = 0;
  totalPages: number;
  needPagination: boolean;
  mypages = [];
  isPagesActive: boolean;

  ngOnInit(): void {
    this.tableData1 = {
      headerRow: [
        "№/Jami",
        "Kitob Nomi",
        "Kitob Muallifi",
        "Kutubxona Nomi",
        "Qaytarilgan Sanasi",
        "Amallar",
      ],
    };
    this.loadReadBooks();
  }

  pagebyNum(ipage) {
    console.log(ipage);
    this.currentPage = ipage;
    this.isPagesActive = true;
    document.getElementById("listcard").scrollIntoView();
    this.loadReadBooks();
  }

  loadReadBooks() {
    return this.usersService.getReadBooks().subscribe({
      next: (res) => {
        this.readBooks = res.readBooks;
        // console.log("books ", this.readBooks);

        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;

        if (this.totalPages > 1) {
          this.needPagination = true;
          for (let i = 0; i < this.totalPages; i++) {
            this.mypages[i] = { id: "name" };
          }
        }
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }
}
