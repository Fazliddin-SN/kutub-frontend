import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalConfigService } from "src/app/global-config.service";
import { AuthService } from "src/app/services/auth-service";
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
export class BooksListComponent implements OnInit, AfterViewInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private config = inject(GlobalConfigService);
  private router = inject(Router);
  private authService = inject(AuthService);
  //
  categories: any[] = [];

  books: Book[] = [];
  tableData1: TableData;
  errorMessage: string = "";

  // pagination
  currentPage: number = 0;
  totalPages: number;
  needPagination: boolean;
  mypages = [];
  isPagesActive: boolean;
  // status needed for filter
  statusList: any[] = [];
  ngOnInit(): void {
    // pagination
    this.currentPage = 0;
    this.needPagination = false;
    this.isPagesActive = false;

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

    this.loadBooks();
    this.fetchBookStatuses();
    this.fetchCategories();
  }

  // get Categories
  fetchCategories() {
    this.config.loadCategories().subscribe({
      next: (res) => {
        // console.log(cats);
        this.categories = res.categories;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }

  // get Categories
  fetchBookStatuses() {
    this.config.getBookStatuses().subscribe({
      next: (res) => {
        // console.log(cats);
        this.statusList = res.bookStatuses;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }

  pagebyNum(ipage) {
    console.log(ipage);
    this.currentPage = ipage;
    this.isPagesActive = true;
    document.getElementById("listcard").scrollIntoView();
    this.loadBooks();
  }

  // fetching book Data
  loadBooks() {
    this.bookService.getBooks(this.currentPage).subscribe({
      next: (res) => {
        this.books = res.books;
        // console.log("books ", this.books);

        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;

        if (this.totalPages > 1) {
          this.needPagination = true;
          for (let i = 0; i < this.totalPages; i++) {
            this.mypages[i] = { id: "name" };
          }
        }
        // console.log("books", this.books);
      },
      error: (err) => {
        //
        this.errorMessage = err.error.error;
      },
    });
  }

  getListOfBooksWIthFilter(
    category_id: string,
    bookTitle: string,
    isbn: string,
    status: string
  ) {
    let filterLink =
      "&category_id=" +
      category_id +
      "&bookTitle=" +
      bookTitle +
      "&isbn=" +
      isbn +
      "&status_id=" +
      status;

    this.bookService
      .getBooksWithFilter(this.currentPage, filterLink)
      .subscribe({
        next: (res) => {
          this.books = res.books;
          this.currentPage = res.currentPage;
          this.totalPages = res.totalPages;

          if (this.totalPages > 1) {
            this.needPagination = true;
            for (let i = 0; i < this.totalPages; i++) {
              this.mypages[i] = { id: "name" };
            }
          }
        },
        error: (err) => {
          this.errorMessage = err.error.error;
          if (err.status === 403) {
            this.authService.logout();
          }
        },
      });
  }
  ngOnDestroy(): void {}
  // get category name

  ngAfterViewInit(): void {
    this.loadBooks();

    return;
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
            this.loadBooks();
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
