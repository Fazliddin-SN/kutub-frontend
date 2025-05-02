import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalConfigService } from "src/app/global-config.service";
import { BookService } from "src/app/services/book.service";
import { Book } from "src/interfaces/book.model";
import { Category } from "src/interfaces/category.model";
import Swal from "sweetalert2";
// table data type
declare interface TableData {
  headerRow: string[];
}
@Component({
  selector: "app-books-list",
  templateUrl: "./books-list.component.html",
  styleUrls: ["./books-list.component.css"],
})
export class BooksListComponent implements OnInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private config = inject(GlobalConfigService);
  private router = inject(Router);

  //
  categories: Category[] = [];
  books: Book[] = [];
  tableData1: TableData;
  errorMessage: string = "";

  // ng

  ngOnInit(): void {
    this.loadBooks();
    this.config.categories$.subscribe({
      next: (cats) => {
        console.log("categories", cats);
        this.categories = cats;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });

    this.tableData1 = {
      headerRow: [
        "№/Jami",
        "Kitob Rasmi",
        "Kitob nomi",
        "Kitob Muallifi",
        "ISBN",
        "Kitob Kategoriyasi",
        "Nashr Sanasi",
        "Status",
        "O'qilish Soni",
        "Amallar",
      ],
    };
  }

  // fetching book Data
  private loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (res) => {
        this.books = res.books;
        console.log("books", this.books);
      },
      error: (err) => {
        //
        this.errorMessage = err.error.error;
      },
    });
  }

  ngOnDestroy(): void {}
  // get category name
  getCategoryName(cat_id: string) {
    // console.log(cat_id);
    let catname: string | undefined = "";
    catname = this.categories.find(
      (c) => c.category_id === cat_id
    )?.category_name;
    // console.log(catname);

    return catname;
  }

  // this navigates to delete component
  delete(bookId: string) {
    Swal.fire({
      icon: "question",
      title: "Ishonchingiz komilmi?",
      text: "Rostan ham bu kitobni o'chirmoqchimisiz?",
      showCancelButton: true,
      confirmButtonText: "Ha, o‘chirish",
      cancelButtonText: "Bekor qilish",
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.removeBook(bookId).subscribe({
          next: () => {
            this.books = this.books.filter((b) => b.book_id !== bookId);
            Swal.fire(
              "O‘chirildi!",
              "Kitob muvaffaqiyatli o‘chirildi.",
              "success"
            );
          },
          error: (err) => {
            this.errorMessage = err.error.error;
            Swal.fire(
              "Xatolik",
              "Kitobni o‘chirishda muammo yuz berdi.",
              "error"
            );
          },
        });
      } else {
        // Optional: show message on cancel
        Swal.fire("Bekor qilindi", "Kitob o‘chirilmadi.", "info");
      }
    });
  }

  // this navigates to edit component
  edit(bookId: string) {
    // console.log(bookId);
    this.router.navigate(["/owner-panel/library", bookId, "edit"], {
      relativeTo: this.route,
    });
  }
}
