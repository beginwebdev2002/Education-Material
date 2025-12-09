import { Component, ChangeDetectionStrategy, inject, output, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MockAuthService } from '@entities/auth/auth.service';
import { AuthStateService } from '@features/auth/auth-state.service';
import { createValidationSignal, maxLengthValidator, minLengthValidator, emailValidator, requiredValidator } from '@shared/validation';
import { RegisterModalService } from './register-modal.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterModalComponent implements OnInit {
  private service: RegisterModalService = inject(RegisterModalService)
  private authState: AuthStateService = inject(AuthStateService);
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

  register(): void {

  }

  buttonText = computed(() => {
    if (this.isLoading()) {
      return $localize`:@@buttonCreatingAccount|Текст кнопки, когда идет процесс регистрации:Creating account...`;
    } else {
      return $localize`:@@buttonCreateAccount|Текст кнопки для начала регистрации:Create account`;
    }
  });

  switchToLogin(): void {
    this.authState.setMode('login');
  }
}