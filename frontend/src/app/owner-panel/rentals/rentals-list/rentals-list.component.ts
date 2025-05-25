import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RentalForm } from "src/app/interfaces/rental.model";
import { RentalsService } from "src/app/services/rentals.service";
import { Book } from "src/interfaces/book.model";
import { LibraryUser } from "src/interfaces/libraryuser.model";
import { rentalService } from "../rental.sevice";
import Swal from "sweetalert2";

declare interface TableData {
  headerRow: string[];
}
@Component({
  selector: "app-rentals-list",
  templateUrl: "./rentals-list.component.html",
  styleUrls: ["./rentals-list.component.css"],
})
export class RentalsListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rentalsService = inject(RentalsService);
  private rental = inject(rentalService);
  //

  private userMap = new Map<string, string>();
  private bookMap = new Map<string, string>();
  //
  rentals: RentalForm[] = [];
  tableData1: TableData;
  // handling error
  errorMessage: string = "";
  members: LibraryUser[] = [];
  books: Book[] = [];

  // methods

  ngOnInit(): void {
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

    this.tableData1 = {
      headerRow: [
        "№/Jami",
        "Ijarachi nomi",
        "Kitob nomi",
        "Ijara Sanasi",
        "Ogohlantirish Sanasi",
        "Qaytarilish Sanasi",
        "Amallar",
      ],
    };

    this.loadRentals();
  }

  loadRentals() {
    // fetching retals data
    this.rentalsService.fetchRentals().subscribe({
      next: (res) => {
        this.rentals = res.rentals.filter((r) => r.status !== "qaytarildi");
        console.log(res.rentals);
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

  // removing the rental from rentals list
  delete(rentalId: string, bookId: string) {
    Swal.fire({
      icon: "question",
      title: "Ichonchingiz komilmi?",
      text: "Rostan ham bu kitob qayarildimi?",
      showCancelButton: true,
      confirmButtonText: "Ha, qaytarildi",
      cancelButtonText: "Yo'q, bekor qilish",
    }).then((result) => {
      if (result.isConfirmed) {
        this.rentalsService.updateRental(rentalId, bookId).subscribe({
          next: () => {
            Swal.fire(
              "Tasdiqlandi!",
              "Ijara tahrirlandi. Kitob qaytarildi!",
              "success"
            );
            this.loadRentals();
          },
          error: (err) => {
            this.errorMessage = err.error.error;
            Swal.fire(
              "Xatolik",
              "Kitobni o'chirishda maummo yuz berdi",
              "error"
            );
          },
        });
      } else {
        // Optional: show message on cancel
        Swal.fire("Bekor qilindi", "Ijara bekor qilinmadi!", "info");
      }
    });
  }

  // editing navigates to update rental component
  edit(rentalId: string) {
    this.router.navigate(["/owner/library/rentals", rentalId, "edit"]);
  }
}
