import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { UserStorageService } from '@core/storage';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private userStorage = inject(UserStorageService);
  private currentUser = this.userStorage.loadUser();
  
  private allowedRoles: string[] = [];
  private hasView = false;

  @Input() set hasRole(roles: string[] | string) {
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    effect(() => {
      this.currentUser(); 
      this.updateView();
    });
  }

  private updateView() {
    const user = this.currentUser();
    const isGuestRole = this.allowedRoles.includes('GUEST');
    
    let hasAccess = false;
    
    if (isGuestRole && !user) {
      hasAccess = true;
    } else if (user && user.role && this.allowedRoles.includes(user.role)) {
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
