import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LibraryUserService } from "src/app/services/library-user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-update-member",
  templateUrl: "./update-member.component.html",
  styleUrls: ["./update-member.component.css"],
})
export class UpdateMemberComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private membersService = inject(LibraryUserService);
  private fb = inject(FormBuilder);
  // form builder
  libUserForm!: FormGroup;
  // handling error
  errorMessage: string = "";
  userId: string = "";

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get("userId");
    });
    // library-user register form
    this.libUserForm = this.fb.group({
      fullname: ["", [Validators.required]],
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      address: ["", [Validators.required]],
      phonenumber: ["", [Validators.required]],
    });
    this.loadMemberById();
  }

  loadMemberById() {
    // fetching user data from backend to fill the form
    this.membersService.getuserById(this.userId).subscribe({
      next: (res) => {
        console.log("user details", res);
        this.libUserForm.patchValue({
          fullname: res.member.member.fullname,
          username: res.member.member.username,
          email: res.member.member.email,
          address: res.member.member.address,
          phonenumber: res.member.member.phonenumber,
        });
      },
      error: (err) => {
        this.errorMessage = err.error;
      },
    });
  }

  // submit the edited data and send to backend
  onSubmit() {
    if (this.libUserForm.invalid) {
      this.errorMessage = "Kerakli malumotlarni kiriting.";
      return;
    }
    // console.log(this.libUserForm.value);

    this.membersService
      .updateUser(this.userId, {
        ...this.libUserForm.value,
      })
      .subscribe({
        next: () => {
          Swal.fire(
            "Success!",
            "Foydalanuvchi malumotlari tahrirlandi!",
            "success"
          ).then(() => {
            this.router.navigate(["/owner/library/members/list"]);
            this.membersService.getMembers();
          });
        },
        error: (err) => {
          this.errorMessage = err.error.error;
        },
      });
  }
}
