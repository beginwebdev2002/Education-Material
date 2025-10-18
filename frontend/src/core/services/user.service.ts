import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
   id: string;
   name: string;
   email: string;
   role: 'teacher' | 'student' | 'admin';
   isActive: boolean;
}

export interface ApiResponse<T> {
   data: T;
   message: string;
   success: boolean;
}

@Injectable({
   providedIn: 'root'
})
export class UserService {
   private http = inject(HttpClient);

   // Private writable signals для внутреннего состояния
   private _users = signal<User[]>([]);
   private _loading = signal(false);
   private _error = signal<string | null>(null);
   private _currentUser = signal<User | null>(null);

   // Public readonly signals для внешнего использования
   readonly users = this._users.asReadonly();
   readonly loading = this._loading.asReadonly();
   readonly error = this._error.asReadonly();
   readonly currentUser = this._currentUser.asReadonly();

   // Computed signals для производных значений
   readonly activeUsers = computed(() =>
      this._users().filter(user => user.isActive)
   );

   readonly teachers = computed(() =>
      this._users().filter(user => user.role === 'teacher')
   );

   readonly students = computed(() =>
      this._users().filter(user => user.role === 'student')
   );

   readonly isLoggedIn = computed(() => this._currentUser() !== null);

   readonly userDisplayName = computed(() => {
      const user = this._currentUser();
      return user ? user.name : 'Guest';
   });

   readonly userRole = computed(() => {
      const user = this._currentUser();
      return user ? user.role : null;
   });

   readonly canManageUsers = computed(() => {
      const role = this.userRole();
      return role === 'admin' || role === 'teacher';
   });

   // Actions для управления состоянием
   async loadUsers(): Promise<void> {
      this._loading.set(true);
      this._error.set(null);

      try {
         const response = await this.http.get<ApiResponse<User[]>>('/api/users').toPromise();
         if (response?.success) {
            this._users.set(response.data);
         } else {
            this._error.set('Failed to load users');
         }
      } catch (error: any) {
         this._error.set(error.message || 'An error occurred while loading users');
      } finally {
         this._loading.set(false);
      }
   }

   async createUser(userData: Omit<User, 'id'>): Promise<User | null> {
      this._loading.set(true);
      this._error.set(null);

      try {
         const response = await this.http.post<ApiResponse<User>>('/api/users', userData).toPromise();
         if (response?.success) {
            const newUser = response.data;
            this._users.update(users => [...users, newUser]);
            return newUser;
         } else {
            this._error.set('Failed to create user');
            return null;
         }
      } catch (error: any) {
         this._error.set(error.message || 'An error occurred while creating user');
         return null;
      } finally {
         this._loading.set(false);
      }
   }

   async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
      this._loading.set(true);
      this._error.set(null);

      try {
         const response = await this.http.put<ApiResponse<User>>(`/api/users/${id}`, userData).toPromise();
         if (response?.success) {
            const updatedUser = response.data;
            this._users.update(users =>
               users.map(user => user.id === id ? updatedUser : user)
            );

            // Обновляем текущего пользователя если это он
            if (this._currentUser()?.id === id) {
               this._currentUser.set(updatedUser);
            }

            return updatedUser;
         } else {
            this._error.set('Failed to update user');
            return null;
         }
      } catch (error: any) {
         this._error.set(error.message || 'An error occurred while updating user');
         return null;
      } finally {
         this._loading.set(false);
      }
   }

   async deleteUser(id: string): Promise<boolean> {
      this._loading.set(true);
      this._error.set(null);

      try {
         const response = await this.http.delete<ApiResponse<void>>(`/api/users/${id}`).toPromise();
         if (response?.success) {
            this._users.update(users => users.filter(user => user.id !== id));

            // Если удаляем текущего пользователя, очищаем его
            if (this._currentUser()?.id === id) {
               this._currentUser.set(null);
            }

            return true;
         } else {
            this._error.set('Failed to delete user');
            return false;
         }
      } catch (error: any) {
         this._error.set(error.message || 'An error occurred while deleting user');
         return false;
      } finally {
         this._loading.set(false);
      }
   }

   async login(email: string, password: string): Promise<boolean> {
      this._loading.set(true);
      this._error.set(null);

      try {
         const response = await this.http.post<ApiResponse<User>>('/api/auth/login', {
            email,
            password
         }).toPromise();

         if (response?.success) {
            this._currentUser.set(response.data);
            return true;
         } else {
            this._error.set('Invalid credentials');
            return false;
         }
      } catch (error: any) {
         this._error.set(error.message || 'Login failed');
         return false;
      } finally {
         this._loading.set(false);
      }
   }

   logout(): void {
      this._currentUser.set(null);
      this._error.set(null);
   }

   clearError(): void {
      this._error.set(null);
   }

   // Utility methods
   getUserById(id: string): User | undefined {
      return this._users().find(user => user.id === id);
   }

   getUserByEmail(email: string): User | undefined {
      return this._users().find(user => user.email === email);
   }

   // Batch operations для множественных обновлений
   async batchUpdateUsers(updates: Array<{ id: string; data: Partial<User> }>): Promise<void> {
      this._loading.set(true);
      this._error.set(null);

      try {
         const response = await this.http.put<ApiResponse<User[]>>('/api/users/batch', {
            updates
         }).toPromise();

         if (response?.success) {
            this._users.set(response.data);
         } else {
            this._error.set('Failed to batch update users');
         }
      } catch (error: any) {
         this._error.set(error.message || 'An error occurred during batch update');
      } finally {
         this._loading.set(false);
      }
   }
}
