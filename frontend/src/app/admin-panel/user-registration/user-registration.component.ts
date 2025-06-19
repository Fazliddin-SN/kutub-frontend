import { Component, inject, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs";
import { GlobalConfigService } from "src/app/global-config.service";
import { Role } from "src/app/interfaces/user.model";
import { AuthService } from "src/app/services/auth-service";
import Swal from "sweetalert2";

// Rename for clarity
let initialFormValue: any = {};
const savedRegisterForm = localStorage.getItem("saved-register-form");
if (savedRegisterForm) {
  try {
    initialFormValue = JSON.parse(savedRegisterForm);
  } catch (error) {
    console.error("Error parsing saved register form:", error);
    initialFormValue = {}; // Fallback to an empty object if parsing fails
  }
}
@Component({
  selector: "app-user-registration",
  templateUrl: "./user-registration.component.html",
  standalone: false,
  styleUrls: ["./user-registration.component.css"],
})
export class UserRegistrationComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private config = inject(GlobalConfigService);
  hasLibrary = false;

  roles: any[] = [];
  // to store and display error messages
  errorMessage: string = "";

  registerForm = new FormGroup({
    fullname: new FormControl(initialFormValue.fullname || "", [
      Validators.required,
      Validators.minLength(4),
    ]),
    username: new FormControl(initialFormValue.username || "", [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl(initialFormValue.email || "", [
      Validators.required,
      Validators.email,
    ]),
    address: new FormControl(initialFormValue.address || "", {
      validators: [Validators.required],
    }),
    phonenumber: new FormControl(initialFormValue.phonenumber || "", {
      validators: [Validators.required],
    }),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),

    // Role is managed with a select element. We can set a default, e.g., 'user'
    role_id: new FormControl(1, [Validators.required]),
  });

  // ngOninit () to save entered values within the form
  ngOnInit(): void {
    const subscription = this.registerForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            "saved-register-form",
            JSON.stringify({
              fullname: value.fullname,
              username: value.username,
              email: value.email,
              address: value.address,
              phonenumber: value.phonenumber,
            })
          );
        },
      });

    this.loadRoles();
  }

  loadRoles() {
    this.config.loadUserRoles().subscribe({
      next: (res) => {
        this.roles = res.roles;
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }
  // email is taken to pass to library-register component
  enteredEmail: string = "";

  // onSubmit method to send form data to backend via authService
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = "Kerakli malumotlarni kiriting.";
      return;
    }

    // if user registered as owner, we should create a library
    if (this.registerForm.value.role_id === 2) {
      this.hasLibrary = true;
      this.enteredEmail = this.registerForm.value.email;
    }

    this.authService.registerUser(this.registerForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          text: "Yangi foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi.",
          timer: 1000,
        }).then(() => {
          if (this.hasLibrary) {
            this.router.navigate(["/admin-panel/add-lib"], {
              queryParams: { email: this.enteredEmail },
            });
            this.registerForm.controls;
            localStorage.removeItem("saved-register-form");
          } else {
            this.router.navigate(["/dashboard"]);
            localStorage.removeItem("saved-register-form");
            this.registerForm.controls;
          }
        });
      },
      error: (err) => {
        // console.log('error ', err);
        this.errorMessage = err.error?.error;
      },
    });
  }

  // close event emitter
  close() {
    localStorage.removeItem("saved-register-form");
    this.router.navigate(["/dashboard"]);
  }

  // toggling password visibility
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
