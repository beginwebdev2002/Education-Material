import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '@features/auth/models/signup.interface';
import { UserEndPoints } from '../users.constants';
import { AuthStateService } from '@features/auth/data-access/auth-state.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);
    private authState = inject(AuthStateService);

    findUserById(id: string): Observable<AuthResponse> {
        return this.http.get<AuthResponse>(UserEndPoints.getUserById(id))
            .pipe(
                map((user: AuthResponse) => {
                    this.authState.setUser(user);
                    return user;
                })
            );
    }
}
