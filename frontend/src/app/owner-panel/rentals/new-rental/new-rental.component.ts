import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs";

import { RentalsService } from "src/app/services/rentals.service";
import { Book } from "src/interfaces/book.model";
import { LibraryUser } from "src/interfaces/libraryuser.model";
import Swal from "sweetalert2";
import { rentalService } from "../rental.sevice";
import { LibraryUserService } from "src/app/services/library-user.service";
import { BookService } from "src/app/services/book.service";

///
let initialFormValue: any = {};
const savedRentalForm = localStorage.getItem("rental-form");
if (savedRentalForm) {
  try {
    initialFormValue = JSON.parse(savedRentalForm);
  } catch (error) {
    console.error("Error parsing saved register form:", error);
    initialFormValue = {}; // Fallback to an empty object if parsing fails
  }
}

@Component({
  selector: "app-new-rental",
  templateUrl: "./new-rental.component.html",
  styleUrls: ["./new-rental.component.css"],
})
export class NewRentalComponent implements OnInit {
  private rentalsService = inject(RentalsService);
  private router = inject(Router);

  constructor(
    private rental: rentalService,
    private memberService: LibraryUserService,
    private booksService: BookService
  ) {
    this.loadMemebersandBooks();
  }
  //
  members: LibraryUser[] = [];
  books: Book[] = [];
  // handling error
  errorMessage: string = "";

  // form
  rentalForm = new FormGroup({
    user_id: new FormControl(initialFormValue.user_id || "", {
      validators: [Validators.required],
    }),
    book_id: new FormControl(initialFormValue.book_id || "", {
      validators: [Validators.required],
    }),
    rental_date: new FormControl(initialFormValue.rental_date || "", {
      validators: [Validators.required],
    }),
    due_date: new FormControl(initialFormValue.due_date || "", {
      validators: [Validators.required],
    }),
    return_date: new FormControl(initialFormValue.return_date || "", {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    // storing the input data in localStorage for some time.
    this.rentalForm.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem(
          "rental-form",
          JSON.stringify({
            user_id: value.user_id,
            book_id: value.book_id,
            rental_date: value.rental_date,
            due_date: value.due_date,
            return_date: value.return_date,
          })
        );
      },
    });
    this.loadMemebersandBooks();

    this.rental.error$.subscribe((msg) => (this.errorMessage = msg));
  }

  isOverDue(dueDate: string) {
    return new Date(dueDate) < new Date();
  }

  loadMemebersandBooks() {
    this.booksService.getBooks().subscribe({
      next: (res) => {
        // console.log("books ", this.books);

        this.books = res.books.filter((book) => book.status !== "ijarada");
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });

    this.memberService.getMembers().subscribe({
      next: (res) => {
        this.members = res.members;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }

  // this.rental.books$.subscribe((books) => {
  //   this.books = books.filter((b) => b.status !== "ijarada");
  // });
  // this.rental.members$.subscribe((m) => (this.members = m));

  // sending data to backend
  onSubmit() {
    if (this.rentalForm.invalid) {
      this.errorMessage = "Kerakli malumotlarni kiriting!";
    }
    // console.log("rental data ", this.rentalForm.value);
    this.rentalsService.createRental(this.rentalForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Yangi Ijara Yaratildi!",
        }).then(() => {
          this.router.navigate(["/owner/library/rentals/list"]);
        });
        localStorage.removeItem("rental-form");
        this.booksService.getBooks();
        this.memberService.getMembers();
        this.loadMemebersandBooks();
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
}
