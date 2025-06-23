import { Component, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth-service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login-cmp",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  // form & state
  loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  errorMessage = "";
  private loginSub?: Subscription;

  constructor(
    private element: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // your existing DOM manipulation…
    const body = document.body;
    body.classList.add("login-page", "off-canvas-sidebar");
    setTimeout(() => {
      const card = this.element.nativeElement.querySelector(".card");
      card?.classList.remove("card-hidden");
    }, 700);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = "Kerakli malumotlarni kiriting.";
      return;
    }

    const { username, password } = this.loginForm.value;

    this.loginSub = this.authService.login(username, password).subscribe({
      next: (res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("avatar", res.user.imageData);
        this.authService.getDecodedToken();
        this.authService.setUserDetails();
        Swal.fire({
          icon: "success",
          text: "Siz muvaffaqiyatli kirdingiz.",
          timer: 1000,
        }).then(() => this.router.navigate(["/dashboard"]));
        this.loginForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "Xatolik yuz berdi";
      },
    });
  }

  ngOnDestroy() {
    document.body.classList.remove("login-page", "off-canvas-sidebar");
    this.loginSub?.unsubscribe();
  }
  password: string = "";
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
