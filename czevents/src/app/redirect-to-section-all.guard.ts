import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedirectToSectionAllGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const section = route.queryParamMap.get('section');
    if (!section) {
      this.router.navigate(['/Buyer'], { queryParams: { section: 'all' } });
      return false; // Prevents activation of the original route
    }
    return true; // Allows activation if 'section' is present
  }
}
