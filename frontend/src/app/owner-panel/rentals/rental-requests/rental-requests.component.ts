import { Component, inject, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RentalRequests } from "src/app/interfaces/rental.model";
import { RentalsService } from "src/app/services/rentals.service";
import Swal from "sweetalert2";
declare interface TableData {
  headerRow: string[];
}
@Component({
  selector: "app-rental-requests",
  templateUrl: "./rental-requests.component.html",
  styleUrls: ["./rental-requests.component.css"],
})
export class RentalRequestsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rentalsService = inject(RentalsService);

  // rental-requets data
  rentalRequests: RentalRequests[] = [];
  rentalRequestError: string = "";
  tableData1: TableData;

  ngOnInit(): void {
    this.fetchRentalRequsts();
    this.tableData1 = {
      headerRow: [
        "№/Jami",
        "Ijarachi emaili",
        "So'rov habari",
        "So'ralgan Kitob",
        "So'rov sanasi",
        "Amallar",
      ],
    };
  }

  // fetching the requests for this owner's library books
  fetchRentalRequsts() {
    this.rentalsService.fetchRentalRequests().subscribe({
      next: (res) => {
        // console.log("response", res);
        this.rentalRequests = res.requests;
      },
      error: (err) => {
        this.rentalRequestError = err.error.error;
      },
    });
  }
  // marks as read, the owner approves the requests
  markAsRead(request: RentalRequests) {
    Swal.fire({
      icon: "question",
      text: "Rostan ham bu so'rovni tasqdiqlaysizmi? ",
      showCancelButton: true,
      confirmButtonText: "Ha, tasdiqlayman.",
      cancelButtonText: "Yo'q, bekor qilish",
    }).then((result) => {
      if (result.isConfirmed) {
        this.rentalsService.markAsRead(request.user_email).subscribe({
          next: () => {
            Swal.fire("Info", "Ijara so'rovi tasdiqlandi!", "success");
            this.rentalRequests = this.rentalRequests.filter(
              (req) => req.request_id !== request.request_id
            );
          },
          error: (err) => {
            Swal.fire("Xatolik", `${err.error.error}`, "error");
          },
        });
      }
      Swal.fire("Info", "So'rov tasdiqlanmadi", "info");
    });
  }
}
