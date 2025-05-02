import { Component, inject, OnInit } from "@angular/core";
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
export class MembersListComponent implements OnInit {
  private memberService = inject(LibraryUserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  //
  members: LibraryUser[] = [];
  errorMessage: string = "";
  tableData1: TableData;

  // ngOnit

  ngOnInit(): void {
    this.memberService.getMembers().subscribe({
      next: (res) => {
        this.members = res.members;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });

    // table data are here
    this.tableData1 = {
      headerRow: [
        "Foydalanuvchi IDsi",
        "Foydalanuvchi Ismi",
        "Foydalanuvchi Nomi",
        "Foydalanuvchi Emaili",
        "Foydalanuvchi Manzili",
        "Foydalanuvchi Tel",
        "Amallar",
      ],
    };
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
