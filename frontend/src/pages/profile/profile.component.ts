import { Component, ChangeDetectionStrategy, computed, inject, signal, effect, DestroyRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
// FIX: Imported `ParamMap` to explicitly type route parameters.
import { ActivatedRoute, RouterLink, ParamMap } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MockAuthService } from '../../entities/auth/auth.service';
import { User } from '../../shared/models/user.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  // FIX: Added explicit types to resolve 'unknown' type errors on injected services.
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authService: MockAuthService = inject(MockAuthService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  isEditing = signal(false);

  // FIX: Explicitly typed `params` as `ParamMap` to correctly infer the return type of `get()`.
  private userId$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
  private user$ = this.userId$.pipe(
    switchMap(id => id ? this.authService.getUserById(id) : of(null))
  );

  user = signal<User | null>(null);

  // Use a separate signal for the form to avoid mutating the original user signal
  profileForm = signal<Partial<User>>({});

  socialMediaLinks: { key: keyof NonNullable<User['socialMedia']>, name: string, icon: string }[] = [
    { key: 'github', name: 'GitHub', icon: 'fab fa-github' },
    { key: 'linkedIn', name: 'LinkedIn', icon: 'fab fa-linkedin' },
    { key: 'telegram', name: 'Telegram', icon: 'fab fa-telegram' },
    { key: 'instagram', name: 'Instagram', icon: 'fab fa-instagram' },
    { key: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp' },
  ];

  constructor() {
    this.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(userData => {
      this.user.set(userData);
    });

    // When the user data loads or changes, update the form signal
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        // Create a deep copy for the form
        this.profileForm.set(JSON.parse(JSON.stringify(currentUser)));
      }
    });
  }

  saveProfile(): void {
    const updatedUser = this.profileForm();
    if (updatedUser && updatedUser.id) {
      this.authService.updateUser(updatedUser as User); // Mock update
    }
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    // Reset form data to the original user data
    const currentUser = this.user();
    if (currentUser) {
      this.profileForm.set(JSON.parse(JSON.stringify(currentUser)));
    }
    this.isEditing.set(false);
  }
}