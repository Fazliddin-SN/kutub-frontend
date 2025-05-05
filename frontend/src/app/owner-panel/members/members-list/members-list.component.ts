import { AfterViewInit, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LibraryUserService } from "src/app/services/library-user.service";
import { LibraryUser } from "src/interfaces/libraryuser.model";
import Swal from "sweetalert2";
// table data type
declare interface TableData {
  headerRow: string[];
}
@Component({
  selector: "app-members-list",
  templateUrl: "./members-list.component.html",
  styleUrls: ["./members-list.component.css"],
})
export class MembersListComponent implements OnInit, AfterViewInit {
  private memberService = inject(LibraryUserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  //
  members: LibraryUser[] = [];
  errorMessage: string = "";
  tableData1: TableData;

  // ngOnit
  // pagination
  currentPage: number = 0;
  totalPages: number;
  needPagination: boolean;
  mypages = [];
  isPagesActive: boolean;
  //

  ngOnInit(): void {
    this.currentPage = 0;
    this.needPagination = false;
    this.isPagesActive = false;

    // table data are here
    this.tableData1 = {
      headerRow: [
        "№/Jami",
        "Foydalanuvchi Ismi",
        "Foydalanuvchi Nomi",
        "Foydalanuvchi Emaili",
        "Foydalanuvchi Manzili",
        "Foydalanuvchi Tel",
        "Amallar",
      ],
    };
  }

  pagebyNum(ipage) {
    console.log(ipage);

    this.currentPage = ipage;
    this.isPagesActive = true;
    document.getElementById("listcard").scrollIntoView();
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.currentPage).subscribe({
      next: (res) => {
        this.members = res.members;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        // console.log("members ", this.members);
        // console.log("total pages ", this.totalPages);
        // console.log("current page ", this.currentPage);

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

  // getting list of members with filter
  getListOfMemsWithFilter(username: any, email: any, phone_number: any) {
    // console.log("phone num ", phone_number);
    // console.log("email ", email);
    // console.log("user name ", username);

    let filterLink =
      "&username=" +
      username +
      "&email=" +
      email +
      "&phone_number=" +
      phone_number;

    this.memberService
      .getMembersWithFilter(this.currentPage, filterLink)
      .subscribe({
        next: (res) => {
          this.members = res.members;
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

  //loading members
  ngAfterViewInit(): void {
    return this.loadMembers();
  }
  // deleting the member by member id
  delete(userId: string) {
    Swal.fire({
      icon: "question",
      title: "Ishonchingiz komilmi?",
      text: "Rostan ham bu kitobni o'chirmoqchimisiz?",
      showCancelButton: true,
      confirmButtonText: "Ha, o‘chirish",
      cancelButtonText: "Bekor qilish",
    }).then((result) => {
      if (result.isConfirmed) {
        this.memberService.removeUser(userId).subscribe({
          next: () => {
            this.members = this.members.filter((m) => m.user_id !== userId);
            Swal.fire(
              "O‘chirildi!",
              "Foydalanuvchi muaffaqiyatli o‘chirildi.",
              "success"
            );
          },
          error: (err) => {
            this.errorMessage = err.error.error;
            Swal.fire(
              "Xatolik",
              "Foydalanuvchi o‘chirishda muammo yuz berdi.",
              "error"
            );
          },
        });
      } else {
        // Optional: show message on cancel
        Swal.fire("Bekor qilindi", "Foydalanuvchi o‘chirilmadi.", "info");
      }
    });
  }

  // editing member data
  edit(userId: string) {
    console.log(userId);
    this.router.navigate(["/owner/library/members", userId, "edit"], {
      relativeTo: this.route,
    });
  }
}
