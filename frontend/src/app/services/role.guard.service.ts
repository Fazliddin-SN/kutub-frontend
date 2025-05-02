import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    // console.log('expectedRoles ', expectedRoles);
    const userRole = this.authService.getUserRole();
    // console.log('user role ', userRole);

    if (userRole && expectedRoles.includes(userRole || '')) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
