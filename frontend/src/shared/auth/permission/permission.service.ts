import { Injectable, computed, inject } from '@angular/core';
import { SessionStore } from '../session.store';
import { UserRole } from '../model/role.model';

/**
 * Role-based permission checks, modeled after ngx-permission's PermissionsService.
 * Backed by the single session role signal, so it stays in sync with sign-in/out automatically.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
    private readonly sessionStore = inject(SessionStore);

    readonly permissions = computed<UserRole[]>(() => {
        const role = this.sessionStore.role();
        return role ? [role] : [];
    });

    hasPermission(roles: UserRole | UserRole[]): boolean {
        const required = Array.isArray(roles) ? roles : [roles];
        if (required.length === 0) {
            return true;
        }
        const granted = this.permissions();
        return required.some((role) => granted.includes(role));
    }
}
