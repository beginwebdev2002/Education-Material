import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private readonly USER_KEY = 'current-user';

  private mockUsers: User[] = [
    {
      id: 'f8b8f4a2-7c1b-4f4e-8e3a-3e4d5f6g7h8i',
      firstName: 'Alex',
      lastName: 'Doe',
      email: 'user@edugen.com',
      avatarUrl: 'https://i.pravatar.cc/150?u=alex',
      role: 'user',
      phoneNumber: '+1-202-555-0104',
      citizenship: 'Canada',
      bio: 'A passionate educator and software developer focused on creating intuitive learning experiences. I believe in the power of technology to democratize education and empower students worldwide.',
      socialMedia: {
        github: 'alexdoe',
        linkedIn: 'alex-doe-edu',
        telegram: 'alexdoe_edu'
      }
    },
    {
      id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'admin@edugen.com',
      avatarUrl: 'https://i.pravatar.cc/150?u=jane',
      role: 'admin',
      phoneNumber: '+1-202-555-0199',
      citizenship: 'United States',
      bio: 'Administrator and curriculum designer with over 15 years of experience in higher education. My goal is to ensure our platform provides the highest quality tools for educators.',
      socialMedia: {
        github: 'janesmith-admin',
        linkedIn: 'jane-smith-admin',
        telegram: 'janesmith_admin'
      }
    },
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
      id: self.crypto.randomUUID(),
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
    const user = this.mockUsers.find(u => u.id === id) || null;
    return of(user).pipe(delay(300));
  }

  updateUser(updatedUser: User): void {
    const index = this.mockUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.mockUsers[index] = updatedUser;
      // If the updated user is the current user, update the signal and storage
      if (this.currentUser()?.id === updatedUser.id) {
        this.currentUser.set(updatedUser);
        this.saveUserToStorage(updatedUser);
      }
    }
  }
}