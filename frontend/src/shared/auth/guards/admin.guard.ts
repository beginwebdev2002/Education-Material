import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../session.store';

export const adminGuard: CanActivateFn = () => {
    const sessionStore = inject(SessionStore);
    const router = inject(Router);

    if (sessionStore.isAdmin()) {
        return true;
    }

    if (!sessionStore.isAuthenticated()) {
        return router.createUrlTree(['/'], { queryParams: { signin: '/admin' } });
    }

    return router.createUrlTree(['/']);
};
