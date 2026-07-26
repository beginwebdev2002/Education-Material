import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { UserStorageService } from '@core/storage';

@Directive({
  selector: '[hasRole]',
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private userStorage = inject(UserStorageService);
  private currentUser = this.userStorage.loadUser();

  hasRole = input.required<string[] | string>();
  private hasView = false;

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  private updateView() {
    const allowedRoles = Array.isArray(this.hasRole()) ? this.hasRole() as string[] : [this.hasRole() as string];
    const user = this.currentUser();
    const isGuestRole = allowedRoles.includes('GUEST');

    let hasAccess = false;

    if (isGuestRole && !user) {
      hasAccess = true;
    } else if (user && user.role && allowedRoles.includes(user.role)) {
      hasAccess = true;
    }

    if (hasAccess && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAccess && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
