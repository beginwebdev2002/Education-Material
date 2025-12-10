import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '@entities/users/model/user.interface';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private readonly USER_KEY = 'current-user';

  private mockUsers: User[] = [
  ];

  currentUser = signal<User | null>(this.loadUserFromStorage());

  login({ email, password }: { email: string; password?: string }): Observable<User> {
    const user = this.mockUsers.find(u => u.email === email);
    if (user) {
      return of(user).pipe(
        delay(1000), // Simulate network delay
        tap(loggedInUser => {
          this.currentUser.set(loggedInUser);
          this.saveUserToStorage(loggedInUser);
        })
      );
    }
    return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  register({ firstName, lastName, email }: { firstName: string, lastName: string; email: string; }): Observable<User> {
    if (this.mockUsers.some(u => u.email === email)) {
      return throwError(() => new Error('Email is already taken')).pipe(delay(1000));
    }
    const newUser: User = {
      _id: self.crypto.randomUUID(),
      firstName,
      lastName,
      email,
      avatarUrl: `https://i.pravatar.cc/150?u=${self.crypto.randomUUID()}`,
      role: 'user',
    };
    this.mockUsers.push(newUser);
    return of(newUser).pipe(
      delay(1000),
      tap(registeredUser => {
        this.currentUser.set(registeredUser);
        this.saveUserToStorage(registeredUser);
      })
    );
  }

  private saveUserToStorage(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private loadUserFromStorage(): User | null {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  // For admin user management and profile page
  getAllUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(500));
  }

  getUserById(id: string): Observable<User | null> {
    const user = this.mockUsers.find(u => u._id === id) || null;
    return of(user).pipe(delay(300));
  }

  updateUser(updatedUser: User): void {
    const index = this.mockUsers.findIndex(u => u._id === updatedUser._id);
    if (index !== -1) {
      this.mockUsers[index] = updatedUser;
      // If the updated user is the current user, update the signal and storage
      if (this.currentUser()?._id === updatedUser._id) {
        this.currentUser.set(updatedUser);
        this.saveUserToStorage(updatedUser);
      }
    }
  }
}