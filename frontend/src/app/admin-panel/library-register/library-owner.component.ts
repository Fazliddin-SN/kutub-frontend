import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth-service";
import Swal from "sweetalert2";

@Component({
  selector: "app-library-owner",
  templateUrl: "./library-owner.component.html",
  styleUrls: ["./library-owner.component.css"],
  standalone: false,
})
export class LibraryOwnerComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  errorMessage: string = "";
  isEmailReadonly = false;
  liis: string = "";

  // library register form
  libForm = new FormGroup({
    email: new FormControl("", {
      validators: [Validators.email, Validators.required],
    }),
    library_name: new FormControl("", {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const ownerEmail = params["email"];
      if (ownerEmail) {
        this.libForm.get("email")!.setValue(ownerEmail);
        this.isEmailReadonly = true;
      }
    });
  }

  // submit the data
  onSubmit() {
    if (this.libForm.invalid) {
      this.errorMessage = "Kerakli Malumotlarni kiriting.";
      return;
    }
    const { library_name, email } = this.libForm.value;
    this.authService.registerLib(email!, library_name!).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
          text: "Foydalanuvchi uchun kutubxona yaratildi",
        }).then(() => {
          this.router.navigate(["/dashboard"]);
        });
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
}
