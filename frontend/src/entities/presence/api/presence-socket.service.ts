import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '@environments/environment';

export interface PresenceSnapshot {
    onlineCount: number;
}

/**
 * Live push of the site-wide online-user count (derived from Users.lastSeenAt on the
 * backend) over a websocket, so the admin dashboard doesn't need to poll.
 */
@Injectable({ providedIn: 'root' })
export class PresenceSocketService {
    private socket: Socket | null = null;

    onlineCount = signal<number | null>(null);

    connect(): void {
        if (this.socket) {
            return;
        }
        this.socket = io(`${environment.API_URL}/presence`, { withCredentials: true });
        this.socket.on('presence:update', (snapshot: PresenceSnapshot) => {
            this.onlineCount.set(snapshot.onlineCount);
        });
    }

    disconnect(): void {
        this.socket?.disconnect();
        this.socket = null;
    }
}
