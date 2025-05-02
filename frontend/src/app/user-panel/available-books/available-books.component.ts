import { Component, inject, OnInit } from "@angular/core";
import { BorrowedBook } from "src/app/interfaces/book.model";

import { AvailableBooks } from "src/app/interfaces/library.model";
import { BookService } from "src/app/services/book.service";
import { RentalsService } from "src/app/services/rentals.service";
import { SimpleUserService } from "src/app/services/simple-user.service";
import Swal from "sweetalert2";
declare interface TableData {
  headerRow: string[];
}
declare interface TableData2 {
  headerRow: string[];
}
@Component({
  selector: "app-available-books",
  templateUrl: "./available-books.component.html",
  styleUrls: ["./available-books.component.css"],
})
export class AvailableBooksComponent implements OnInit {
  private booksService = inject(BookService);
  private usersService = inject(SimpleUserService);
  private rentalsService = inject(RentalsService);
  tableData1: TableData;
  tableData2: TableData2;

  availableBooks: AvailableBooks[] = [];
  borrowedBooks: BorrowedBook[] = [];
  availableBooksError: string = "";
  borrowedBooksError: string = "";

  // for loading spinner
  loading = {
    availableBooks: true,
    borrowedBooks: true,
  };

  ngOnInit(): void {
    this.loadBorrowedBooks();
    this.laodAvailableBooks();

    this.tableData1 = {
      headerRow: [
        "Soni",
        "Kitob nomi",
        "Kitob Muallifi",
        "Kitob Nash sanasi",
        "Kategoriyasi",
        "Holati",
        "Kutubxona Nomi",
        "Kutubxona Egasi Ismi",
        "Kutubxona Egasi Manzili",
        "O'qilish Soni",
        "Amallar",
      ],
    };
    this.tableData2 = {
      headerRow: [
        "Soni",
        "Kitob nomi",
        "Kitob Muallifi",
        "Kutubxona Nomi",
        "Ijara Olish Sanasi",
        "Qaytarish Sanasi",
      ],
    };
  }

  laodAvailableBooks() {
    this.usersService.getAvailabelBooks().subscribe({
      next: (res) => {
        // console.log(res);

        this.availableBooks = res.books;
        // console.log("Available books ", res.books);

        this.loading.availableBooks = false;
      },
      error: (err) => (this.availableBooksError = err.error.error),
    });
  }

  // loading all borrowed books
  loadBorrowedBooks() {
    this.usersService.getBorrowedBooks().subscribe({
      next: (res) => {
        if (res.rentals.length === 0) {
          this.borrowedBooksError =
            "Sizda ijarag olingan kitoblar mavjud emas!";
          return;
        }

        this.borrowedBooks = res.rentals;

        this.loading.borrowedBooks = false;
      },
      error: (err) => {
        console.log("error ", err.error.error);

        this.borrowedBooksError = err.error.error;
      },
    });
  }

  user_email = localStorage.getItem("user_email");
  // sending the rental request for the selected book
  createRequest(book: AvailableBooks) {
    // console.log("email ", this.user_email);
    Swal.fire({
      title: `Kitob: "${book.title}"`,
      input: "textarea",
      inputLabel: "Ijara so'rovi uchun.",
      inputPlaceholder: "IJara uchun habaringizni shu yerga yozing...",
      inputAttributes: {
        "aria-label": "Xabar kiriting!",
        rows: "4",
      },
      showCancelButton: true,
      confirmButtonText: "Yuborish",
      cancelButtonText: "Bekor Qilish",
      inputValidator: (value) => {
        if (!value || value.length < 10) {
          return "Xabar kiritilishi va kamida 10 belgidan iborat bo'lishi shart";
        }
      },
    }).then((result) => {
      const message = result.value;
      if (result.isConfirmed) {
        this.rentalsService
          .createRequest({
            user_email: this.user_email,
            book_id: book.book_id,
            owner_id: book.user_id,
            message: message,
          })
          .subscribe({
            next: () => {
              Swal.fire(
                "Yuborildi!",
                "Ijara so'rovingiz yuborildi.",
                "success"
              );
            },
            error: (err) => {
              Swal.fire("Xatolik!", `${err.error.error}`, "error");
            },
          });
        return;
      }

      Swal.fire("Info", "So'rov yuborilmadi!", "error");
    });
  }
}
