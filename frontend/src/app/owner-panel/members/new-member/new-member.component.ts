import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs";
import { LibraryUserService } from "src/app/services/library-user.service";
import Swal from "sweetalert2";

// preventing data vanishing even when page refreshed.
let initialFormValue: any = {};
const savedLibUserForm = localStorage.getItem("libuser-form");
if (savedLibUserForm) {
  try {
    initialFormValue = JSON.parse(savedLibUserForm);
  } catch (error) {
    console.error("Error parsing saved register form:", error);
    initialFormValue = {}; // Fallback to an empty object if parsing fails
  }
}
@Component({
  selector: "app-new-member",
  templateUrl: "./new-member.component.html",
  styleUrls: ["./new-member.component.css"],
})
export class NewMemberComponent implements OnInit {
  private router = inject(Router);
  private membersService = inject(LibraryUserService);

  // error handling
  errorMessage: string = "";

  // library-user register form
  libUserForm = new FormGroup({
    full_name: new FormControl(initialFormValue.full_name || "", {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    user_name: new FormControl(initialFormValue.user_name || "", {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl(initialFormValue.email || "", {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl("", {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    address: new FormControl(initialFormValue.address || "", {
      validators: [Validators.required],
    }),
    phone_number: new FormControl(initialFormValue.phone_number || "", {
      validators: [Validators.required],
    }),
  });

  // sending data to backend
  ngOnInit(): void {
    const subscription = this.libUserForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            "libuser-form",
            JSON.stringify({
              full_name: value.full_name,
              user_name: value.user_name,
              email: value.email,
              address: value.address,
              phone_number: value.phone_number,
            })
          );
        },
      });
    //
  }

  // submitting the form
  onSubmit() {
    if (this.libUserForm.invalid) {
      this.libUserForm.markAllAsTouched();
      this.errorMessage = "Kerakli malumotlarni kiriting.";
      return;
    }
    // console.log(this.libUserForm.value);
    const subscription = this.membersService
      .register(this.libUserForm.value)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: "success",
            text: "Yangi Foydalanuvchi qo'shildi!",
            timer: 1000,
          }).then(() => {
            this.router.navigate(["/owner/library/members/list"]);
            this.libUserForm.reset();
            localStorage.removeItem("libuser-form");
          });
        },
        error: (err) => {
          this.errorMessage = err.error.error;
        },
      });
  }

  // password showing feature
  password: string = "";
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
