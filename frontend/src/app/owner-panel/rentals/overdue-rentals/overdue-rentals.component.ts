import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RentalsService } from "src/app/services/rentals.service";
import Swal from "sweetalert2";

declare interface TableData {
  headerRow: string[];
}
@Component({
  selector: "app-overdue-rentals",
  templateUrl: "./overdue-rentals.component.html",
  styleUrls: ["./overdue-rentals.component.css"],
})
export class OverdueRentalsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rentalsService = inject(RentalsService);

  overdues: any[] = [];
  errorMessage: string;
  // pagination
  currentPage: number = 0;
  totalPages: number;
  needPagination: boolean;
  mypages = [];
  isPagesActive: boolean;

  tableData1: TableData;

  ngOnInit(): void {
    this.tableData1 = {
      headerRow: [
        "№/Jami",
        "Kitob nomi",
        "Isbn",
        "Ijarachi Nomi",
        "Ism-Familiyasi",
        "Ijarachi Teli",
        "Statusi",
        "Qaytarilish Sanasi",
        "Amallar",
      ],
    };
    this.loadOverDueRentals();
  }

  loadOverDueRentals() {
    return this.rentalsService.fetchOverDueRentals().subscribe({
      next: (res) => {
        this.overdues = res.overDueRentals;
        console.log("overdues ", this.overdues);

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
      },
    });
  }

  // mark as returned
  markAsReturned(rentalId: string, bookId: string) {
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
            this.loadOverDueRentals();
          },
          error: (err) => {
            this.errorMessage = err.error.error;
            Swal.fire(
              "Xatolik",
              "Ijarani tahrirlashda xatolik yuz berdi. " + err.error.error,
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
}
