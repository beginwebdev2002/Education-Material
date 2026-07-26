import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { PermissionService } from './permission.service';
import { UserRole } from '../model/role.model';

/**
 * Structural directive that renders its content only when the current user
 * holds NONE of the given roles — the ngx-permission `*ngxPermissionsExcept` equivalent.
 *
 * Usage:
 *   <div *appPermissionExcept="['ADMIN']">Hidden from admins</div>
 */
@Directive({ selector: '[appPermissionExcept]' })
export class PermissionExceptDirective {
    private readonly templateRef = inject(TemplateRef<unknown>);
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly permissionService = inject(PermissionService);

    roles = input<UserRole | UserRole[]>([], { alias: 'appPermissionExcept' });
    elseTemplate = input<TemplateRef<unknown> | null>(null, { alias: 'appPermissionExceptElse' });

    constructor() {
        effect(() => {
            const excluded = this.permissionService.hasPermission(this.roles());
            this.viewContainer.clear();
            if (!excluded) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            } else if (this.elseTemplate()) {
                this.viewContainer.createEmbeddedView(this.elseTemplate()!);
            }
        });
    }
}
