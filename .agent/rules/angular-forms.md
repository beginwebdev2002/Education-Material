---
trigger: glob
globs: src/**/
---

---
description: "Angular Forms in Zoneless Mode"
alwaysApply: true
---

# Angular Forms в Zoneless режиме

## Reactive Forms с Signals

### Базовая форма с signals
```typescript
import { Component, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label>Name:</label>
        <input formControlName="name" [class.error]="nameError()">
        @if (nameError()) {
          <span class="error-message">{{ nameError() }}</span>
        }
      </div>
      
      <div>
        <label>Email:</label>
        <input formControlName="email" [class.error]="emailError()">
        @if (emailError()) {
          <span class="error-message">{{ emailError() }}</span>
        }
      </div>
      
      <button type="submit" [disabled]="!form.valid || submitting()">
        {{ submitting() ? 'Saving...' : 'Save' }}
      </button>
    </form>
  `
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  
  form: FormGroup;
  submitting = signal(false);
  
  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  // Computed для ошибок валидации
  nameError = computed(() => {
    const control = this.form.get('name');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Name is required';
      if (control.errors['minlength']) return 'Name must be at least 2 characters';
    }
    return null;
  });
  
  emailError = computed(() => {
    const control = this.form.get('email');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email';
    }
    return null;
  });
  
  async onSubmit() {
    if (this.form.valid) {
      this.submitting.set(true);
      try {
        await this.saveUser(this.form.value);
        this.form.reset();
      } catch (error) {
        console.error('Save failed:', error);
      } finally {
        this.submitting.set(false);
      }
    }
  }
  
  private async saveUser(userData: any) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## Signal-based Forms (новый подход)

### Использование signal-based форм
```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signal-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <div>
        <label>Name:</label>
        <input 
          [(ngModel)]="name" 
          name="name"
          [class.error]="nameError()"
          required
          minlength="2"
        >
        @if (nameError()) {
          <span class="error-message">{{ nameError() }}</span>
        }
      </div>
      
      <div>
        <label>Email:</label>
        <input 
          [(ngModel)]="email" 
          name="email"
          type="email"
          [class.error]="emailError()"
          required
        >
        @if (emailError()) {
          <span class="error-message">{{ emailError() }}</span>
        }
      </div>
      
      <button type="submit" [disabled]="!isFormValid() || submitting()">
        {{ submitting() ? 'Saving...' : 'Save' }}
      </button>
    </form>
  `
})
export class SignalFormComponent {
  // Form data as signals
  name = signal('');
  email = signal('');
  submitting = signal(false);
  
  // Validation computed signals
  nameError = computed(() => {
    const value = this.name();
    if (value.length === 0) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return null;
  });
  
  emailError = computed(() => {
    const value = this.email();
    if (value.length === 0) return 'Email is required';
    if (!this.isValidEmail(value)) return 'Please enter a valid email';
    return null;
  });
  
  isFormValid = computed(() => {
    return !this.nameError() && !this.emailError() && 
           this.name().length > 0 && this.email().length > 0;
  });
  
  async onSubmit() {
    if (this.isFormValid()) {
      this.submitting.set(true);
      try {
        const formData = {
          name: this.name(),
          email: this.email()
        };
        await this.saveData(formData);
        this.resetForm();
      } catch (error) {
        console.error('Save failed:', error);
      } finally {
        this.submitting.set(false);
      }
    }
  }
  
  private resetForm() {
    this.name.set('');
    this.email.set('');
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  private async saveData(data: any) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## Динамические формы

### Создание динамических форм с signals
```typescript
import { Component, signal, computed } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number';
  label: string;
  required: boolean;
  value: any;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div formArrayName="fields">
        @for (field of fields(); track field.id; let i = $index) {
          <div [formGroupName]="i" class="field-group">
            <label>{{ field.label }}:</label>
            
            @switch (field.type) {
              @case ('text') {
                <input 
                  type="text" 
                  formControlName="value"
                  [class.error]="getFieldError(i)()"
                >
              }
              @case ('email') {
                <input 
                  type="email" 
                  formControlName="value"
                  [class.error]="getFieldError(i)()"
                >
              }
              @case ('number') {
                <input 
                  type="number" 
                  formControlName="value"
                  [class.error]="getFieldError(i)()"
                >
              }
            }
            
            @if (getFieldError(i)()) {
              <span class="error-message">{{ getFieldError(i)() }}</span>
            }
            
            <button type="button" (click)="removeField(i)">Remove</button>
          </div>
        }
      </div>
      
      <div class="form-actions">
        <button type="button" (click)="addField()">Add Field</button>
        <button type="submit" [disabled]="!form.valid || submitting()">
          {{ submitting() ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </form>
  `
})
export class DynamicFormComponent {
  private fb = inject(FormBuilder);
  
  form: FormGroup;
  fields = signal<FormField[]>([]);
  submitting = signal(false);
  
  constructor() {
    this.form = this.fb.group({
      fields: this.fb.array([])
    });
    
    // Добавляем начальное поле
    this.addField();
  }
  
  getFieldError(index: number) {
    return computed(() => {
      const fieldArray = this.form.get('fields') as FormArray;
      const fieldGroup = fieldArray.at(index) as FormGroup;
      const control = fieldGroup.get('value');
      
      if (control?.touched && control?.errors) {
        if (control.errors['required']) return 'This field is required';
        if (control.errors['email']) return 'Please enter a valid email';
      }
      return null;
    });
  }
  
  addField() {
    const newField: FormField = {
      id: this.generateId(),
      type: 'text',
      label: 'New Field',
      required: false,
      value: ''
    };
    
    this.fields.update(fields => [...fields, newField]);
    
    const fieldArray = this.form.get('fields') as FormArray;
    fieldArray.push(this.fb.group({
      id: [newField.id],
      type: [newField.type],
      label: [newField.label],
      required: [newField.required],
      value: [newField.value, newField.required ? Validators.required : null]
    }));
  }
  
  removeField(index: number) {
    this.fields.update(fields => fields.filter((_, i) => i !== index));
    
    const fieldArray = this.form.get('fields') as FormArray;
    fieldArray.removeAt(index);
  }
  
  async onSubmit() {
    if (this.form.valid) {
      this.submitting.set(true);
      try {
        const formData = this.form.value;
        await this.saveFormData(formData);
      } catch (error) {
        console.error('Save failed:', error);
      } finally {
        this.submitting.set(false);
      }
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  private async saveFormData(data: any) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## Валидация форм

### Кастомные валидаторы с signals
```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Кастомный валидатор
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
      .filter(Boolean).length;
    
    if (strength < 3) {
      return { passwordStrength: { strength, message: 'Password too weak' } };
    }
    
    return null;
  };
}

// Использование в компоненте
@Component({
  template: `
    <div>
      <input 
        type="password" 
        formControlName="password"
        [class.error]="passwordError()"
      >
      @if (passwordError()) {
        <span class="error-message">{{ passwordError() }}</span>
      }
      <div class="password-strength">
        Strength: {{ passwordStrength() }}/4
      </div>
    </div>
  `
})
export class PasswordFormComponent {
  form = this.fb.group({
    password: ['', [Validators.required, passwordStrengthValidator()]]
  });
  
  passwordError = computed(() => {
    const control = this.form.get('password');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['passwordStrength']) {
        return control.errors['passwordStrength'].message;
      }
    }
    return null;
  });
  
  passwordStrength = computed(() => {
    const control = this.form.get('password');
    if (control?.errors?.['passwordStrength']) {
      return control.errors['passwordStrength'].strength;
    }
    return 0;
  });
}
```

## Лучшие практики

1. **Используйте computed для валидации**: Создавайте computed signals для ошибок валидации
2. **Группируйте связанные поля**: Используйте FormGroup для логически связанных полей
3. **Обрабатывайте async валидацию**: Используйте async validators для проверки на сервере
4. **Предоставляйте обратную связь**: Показывайте состояние загрузки и ошибки
5. **Используйте trackBy**: Для динамических списков полей
6. **Очищайте ресурсы**: Отписывайтесь от observables в ngOnDestroy