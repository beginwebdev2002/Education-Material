import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { randomUUID } from 'crypto';

interface UploadedAvatarFile {
    originalname: string;
    mimetype: string;
}

const AVATAR_ALLOWED_MIME_TYPES: Record<string, boolean> = {
    'image/jpeg': true,
    'image/png': true,
    'image/webp': true,
    'image/gif': true,
};

export function createUsersAvatarMulterOptions(config: ConfigService): MulterModuleOptions {
    const uploadDir = config.get<string>('uploads.avatarsDir')!;
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }

    return {
        storage: diskStorage({
            destination: uploadDir,
            filename: (_req, file: UploadedAvatarFile, callback) => {
                callback(null, `${randomUUID()}${extname(file.originalname)}`);
            },
        }),
        limits: {
            fileSize: config.get<number>('uploads.maxAvatarSizeBytes'),
        },
        fileFilter: (_req, file: UploadedAvatarFile, callback) => {
            if (!AVATAR_ALLOWED_MIME_TYPES[file.mimetype]) {
                callback(new BadRequestException('Only JPEG, PNG, WEBP or GIF images are allowed'), false);
                return;
            }
            callback(null, true);
        },
    };
}
