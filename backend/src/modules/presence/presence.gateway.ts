import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { parse } from 'cookie';
import { Namespace, Socket } from 'socket.io';
import { UsersService } from '@modules/users/users.service';
import { UserRole } from '@modules/users/user-role.enum';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { PresenceService } from '@modules/presence/presence.service';

const BROADCAST_INTERVAL_MS = 15_000;

/**
 * Pushes site-wide active-user counts (derived from Users.lastSeenAt) to connected
 * admin dashboards. Presence here means "admin is watching the dashboard right now",
 * but the number being pushed reflects real site-wide activity, not socket connections.
 */
@WebSocketGateway({
    cors: { origin: process.env.API_URL, credentials: true },
    namespace: '/presence',
})
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
    @WebSocketServer()
    private readonly server!: Namespace;

    private readonly logger = new Logger(PresenceGateway.name);
    private broadcastInterval?: ReturnType<typeof setInterval>;

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly presenceService: PresenceService,
    ) { }

    async handleConnection(client: Socket): Promise<void> {
        const isAuthorized = await this.authorize(client);
        if (!isAuthorized) {
            client.disconnect(true);
            return;
        }

        const snapshot = await this.presenceService.getSnapshot();
        client.emit('presence:update', snapshot);
    }

    handleDisconnect(_client: Socket): void {
        // No per-socket state to clean up - the admin room is just "currently connected sockets".
    }

    onModuleInit(): void {
        this.broadcastInterval = setInterval(() => {
            this.broadcast().catch((error: Error) => this.logger.error('Failed to broadcast presence snapshot', error));
        }, BROADCAST_INTERVAL_MS);
    }

    onModuleDestroy(): void {
        if (this.broadcastInterval) {
            clearInterval(this.broadcastInterval);
        }
    }

    private async broadcast(): Promise<void> {
        if (!this.server || this.server.sockets.size === 0) {
            return;
        }
        const snapshot = await this.presenceService.getSnapshot();
        this.server.emit('presence:update', snapshot);
    }

    private async authorize(client: Socket): Promise<boolean> {
        try {
            const cookieHeader = client.handshake.headers.cookie;
            if (!cookieHeader) {
                return false;
            }
            const token = parse(cookieHeader)['jwt_token'];
            if (!token) {
                return false;
            }
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
            const user = await this.usersService.findById(payload._id);
            return user?.role === UserRole.ADMIN;
        } catch {
            return false;
        }
    }
}
