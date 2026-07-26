import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { PermissionService } from './permission.service';
import { UserRole } from '../model/role.model';

/**
 * Structural directive that renders its content only when the current user
 * holds one of the given roles — the ngx-permission `*ngxPermissionsOnly` equivalent.
 *
 * Usage:
 *   <div *appPermissionOnly="['ADMIN']">Admin only</div>
 *   <div *appPermissionOnly="['ADMIN']; else noAccess">Admin only</div>
 */
@Directive({ selector: '[appPermissionOnly]' })
export class PermissionOnlyDirective {
    private readonly templateRef = inject(TemplateRef<unknown>);
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly permissionService = inject(PermissionService);

    roles = input<UserRole | UserRole[]>([], { alias: 'appPermissionOnly' });
    elseTemplate = input<TemplateRef<unknown> | null>(null, { alias: 'appPermissionOnlyElse' });

    constructor() {
        effect(() => {
            const allowed = this.permissionService.hasPermission(this.roles());
            this.viewContainer.clear();
            if (allowed) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            } else if (this.elseTemplate()) {
                this.viewContainer.createEmbeddedView(this.elseTemplate()!);
            }
        });
    }
}
