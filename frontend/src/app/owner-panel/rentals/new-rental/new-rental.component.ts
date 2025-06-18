import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  switchMap,
} from "rxjs";

import { RentalsService } from "src/app/services/rentals.service";
import Swal from "sweetalert2";

import { LibraryUserService } from "src/app/services/library-user.service";
import { BookService } from "src/app/services/book.service";
import { GlobalConfigService } from "src/app/global-config.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { map as rxMap } from "rxjs/operators";

@Component({
  selector: "app-new-rental",
  templateUrl: "./new-rental.component.html",
  styleUrls: ["./new-rental.component.css"],
})
export class NewRentalComponent implements OnInit {
  private rentalsService = inject(RentalsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(
    private memberService: LibraryUserService,
    private booksService: BookService,
    private config: GlobalConfigService,
    private http: HttpClient
  ) {}

  isEdit = false;
  rentalId!: string;
  rental = {};

  filteredBooks$: any;
  filteredMembers$: any;

  bookSearch = new FormControl("");
  memberSearch = new FormControl("");

  currentPage = 0;
  // handling error
  errorMessage: string = "";

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

  // token and header
  token: string | null = localStorage.getItem("token");
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const rental_id = params.get("rentalId");
      if (rental_id) {
        this.isEdit = true;
        this.rentalId = rental_id;
        this.loadRentalById(rental_id);
      }
    });

    this.filteredBooks$ = this.bookSearch.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((search) =>
        this.http.get(`${this.config.baseUrl}/books/avialable`, {
          params: { search, page: 0, size: 50 },
          headers: this.headers,
        })
      )
    );

    // MEMBER autocomplete
    this.filteredMembers$ = this.memberSearch.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((username) =>
        this.memberService.getMembersWithFilter(0, `&username=${username}`)
      ),
      rxMap((res) => res.members)
    );
    // console.log("filered members ", this.filteredMembers$);
  }

  loadRentalById(rentalId: string) {
    this.rentalsService.fetchRentalById(+rentalId).subscribe({
      next: (res) => {
        this.rentalForm.patchValue({
          user_id: res.rental.user_id,
          book_id: res.rental.book_id,
          rental_date: res.rental.rental_date.split("T")[0],
          due_date: res.rental.due_date.split("T")[0],
          return_date: res.rental.return_date.split("T")[0],
        });
        // console.log("rental form ", this.rentalForm.value);

        this.memberSearch.setValue(res.rental);
        this.bookSearch.setValue(res.rental.book);
      },

      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }

  // 1. helper to show the right text in the input
  displayMember(user: any): string {
    return user?.member?.username || "";
  }
  displayBook(book: any): string {
    return book?.title || "";
  }

  onBookSelected(book: any) {
    // write the chosen ID into the hidden control
    this.rentalForm.patchValue({ book_id: book.id });
  }

  onMemberSelected(member: any) {
    this.rentalForm.patchValue({ user_id: member.user_id });
  }
  // sending data to backend
  onSubmit() {
    if (this.rentalForm.invalid) {
      this.errorMessage = "Kerakli malumotlarni kiriting!";
    }

    if (this.isEdit) {
      return this.rentalsService
        .updateRentalData(this.rentalId, this.rentalForm.value)
        .subscribe({
          next: () => {
            Swal.fire(
              "Success!",
              "Ijara malumotlari tahrirlandi!",
              "success"
            ).then(() => {
              this.router.navigate(["/owner/library/rentals/list"]);
              this.rentalsService.fetchRentals();
            });
          },
          error: (err) => {
            this.errorMessage = err.error.error;
          },
        });
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
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
}
