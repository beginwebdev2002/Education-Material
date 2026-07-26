import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createHash } from 'crypto';
import { RefreshToken, RefreshTokenDocument } from '@modules/auth/domain/refresh-token.schema';

export interface CreateRefreshTokenInput {
    userId: string;
    rawToken: string;
    expiresAt: Date;
    userAgent?: string;
    ip?: string;
}

@Injectable()
export class RefreshTokenRepository {
    constructor(
        @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    ) { }

    hash(rawToken: string): string {
        return createHash('sha256').update(rawToken).digest('hex');
    }

    async create(input: CreateRefreshTokenInput): Promise<RefreshTokenDocument> {
        return this.refreshTokenModel.create({
            user: new Types.ObjectId(input.userId),
            tokenHash: this.hash(input.rawToken),
            expiresAt: input.expiresAt,
            userAgent: input.userAgent,
            ip: input.ip,
        });
    }

    async findValidByRawToken(rawToken: string): Promise<RefreshTokenDocument | null> {
        return this.refreshTokenModel.findOne({
            tokenHash: this.hash(rawToken),
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        }).exec();
    }

    async revokeById(id: string): Promise<void> {
        await this.refreshTokenModel.updateOne({ _id: id }, { $set: { revokedAt: new Date() } }).exec();
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.refreshTokenModel.updateMany(
            { user: new Types.ObjectId(userId), revokedAt: null },
            { $set: { revokedAt: new Date() } },
        ).exec();
    }
}
