import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RentalsService } from "src/app/services/rentals.service";
import { rentalService } from "../rental.sevice";
import { LibraryUser } from "src/interfaces/libraryuser.model";
import { Book } from "src/interfaces/book.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-update-rental",
  templateUrl: "./update-rental.component.html",
  styleUrls: ["./update-rental.component.css"],
})
export class UpdateRentalComponent implements OnInit {
  private rentalsService = inject(RentalsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  //
  private userMap = new Map<string, string>();
  private bookMap = new Map<string, string>();
  constructor(private rental: rentalService) {}
  //
  members: LibraryUser[] = [];
  books: Book[] = [];
  // handling error
  errorMessage: string = "";
  rentalId: string = "";
  // form
  rentalForm = new FormGroup({
    user_id: new FormControl("", {
      validators: [Validators.required],
    }),
    book_id: new FormControl("", {
      validators: [Validators.required],
    }),
    rental_date: new FormControl("", {
      validators: [Validators.required],
    }),
    due_date: new FormControl("", {
      validators: [Validators.required],
    }),
    return_date: new FormControl("", {
      validators: [Validators.required],
    }),
  });
  //
  ngOnInit(): void {
    // getting the renal ID
    this.route.paramMap.subscribe((params) => {
      this.rentalId = params.get("rentalId");
    });

    // Books fetching
    this.rental.books$.subscribe((b) => {
      this.books = b;
      this.bookMap.clear();
      this.books.forEach((b) => this.bookMap.set(b.book_id, b.title));
    });
    // members fecthing
    this.rental.members$.subscribe((m) => {
      // console.log("members list ", m);
      this.members = m;
      this.userMap.clear();
      this.members.forEach((m) => this.userMap.set(m.user_id, m.username));
    });
    // error Handling
    this.rental.error$.subscribe((msg) => (this.errorMessage = msg));

    // fetching rental data from backend to fill the form
    this.rentalsService.fetchRental(this.rentalId).subscribe({
      next: (res) => {
        // console.log("Rental data ", res.rental);
        const rental = res.rental;
        this.rentalForm.patchValue({
          user_id: rental.user_id,
          book_id: rental.book_id,
          rental_date: rental.rental_date.split("T")[0],
          due_date: rental.due_date.split("T")[0],
          return_date: rental.return_date.split("T")[0],
        });
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
  // getting user's username
  userName(id: string): string | undefined {
    return this.userMap.get(id) ?? "—";
  }

  // book's name
  bookName(id: string) {
    // console.log("book Id", id);
    return this.bookMap.get(id) ?? "—";
  }

  onSubmit() {
    if (this.rentalForm.invalid) {
      this.errorMessage = "Kerakli Malumotlar kiritilshi shart";
      return;
    }

    this.rentalsService
      .updateRentalData(this.rentalId, this.rentalForm.value)
      .subscribe({
        next: () => {
          Swal.fire(
            "Success!",
            "Ijara malumotlari tahrirlandi!",
            "success"
          ).then(() => {
            this.router.navigate(["/owner/library/rentals/list"]);
          });
        },
        error: (err) => {
          this.errorMessage = err.error.error;
        },
      });
  }
}
