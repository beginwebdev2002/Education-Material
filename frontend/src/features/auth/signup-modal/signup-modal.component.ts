import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '@features/auth/data-access/auth-state.service';
import { AuthUiService } from '@features/auth/auth-ui.service';
import { createValidationSignal, emailValidator, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';
import { AuthService } from '@features/auth/data-access/auth.service';
import { SignupPayload } from '@features/auth/models/signup.interface';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
  providers: [AuthService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupModalComponent implements OnInit {
  private authService: AuthService = inject(AuthService)
  private authState: AuthStateService = inject(AuthStateService);
  private authUi: AuthUiService = inject(AuthUiService);
  close = output<void>();

  firstName = signal("");
  lastName = signal("");
  email = signal("");
  password = signal("");
  isLoading = signal(false);
  error = signal<string | null>(null);

  touchedFields = signal<Set<string>>(new Set());

  formErrors = computed(() => {
    const errors = {
      firstName: createValidationSignal(this.firstName, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
      lastName: createValidationSignal(this.lastName, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
      email: createValidationSignal(this.email, [requiredValidator, minLengthValidator(3), maxLengthValidator(50), emailValidator]),
      password: createValidationSignal(this.password, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
    }

    return errors;
  })

  hasErrors = computed(() => {
    const errors = this.formErrors();
    return Object.values(errors).some(fieldErrors => fieldErrors().length > 0);
  });

  ngOnInit(): void {
  }

  markTouched(field: string) {
    this.touchedFields.update(s => {
      const newSet = new Set(s);
      newSet.add(field);
      return newSet;
    });
  }

  isTouched(field: string) {
    return this.touchedFields().has(field);
  }

  signup(): void {
    this.isLoading.set(true);
    const payload: SignupPayload = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password(),
    }
    this.authService.signup(payload)
      .subscribe({
        next: (response) => {
          console.log("responce:", response);

          this.authState.setUser(response);
          this.isLoading.set(false);
          this.close.emit();
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set(error);
        }
      })
  }

  buttonText = computed(() => {
    if (this.isLoading()) {
      return $localize`:@@buttonCreatingAccount|Текст кнопки, когда идет процесс регистрации:Creating account...`;
    } else {
      return $localize`:@@buttonCreateAccount|Текст кнопки для начала регистрации:Create account`;
    }
  });

  switchToLogin(): void {
    this.authUi.setMode('login');
  }
}