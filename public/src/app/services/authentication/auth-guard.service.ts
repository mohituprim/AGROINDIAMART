import { Injectable }     from '@angular/core';
import { CanActivate, CanActivateChild, Router }    from '@angular/router';

import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private authService: AuthenticationService, private router: Router) {}
    canActivate() : boolean {
        console.log('AuthGuard#canActivate called ' + this.authService.isAuthenticated );
        return this.checkLoggedIn("random");
    }

    canActivateChild() : boolean {
        return this.canActivate();
    }

    checkLoggedIn(url: string): boolean {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        this.authService.redirectUrl = url;
        this.router.navigate(['/login']);
        return false;
    }

}
