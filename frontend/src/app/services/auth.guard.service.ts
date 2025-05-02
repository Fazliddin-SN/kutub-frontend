import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth-service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  // this is a basic login check
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // console.log('is logged in', this.authService.isLoggedIn());
      return true;
    }
    this.router.navigate(["/"]);
    return false;
  }
}
