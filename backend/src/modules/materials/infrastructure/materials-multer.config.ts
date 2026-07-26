import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { MATERIAL_ALLOWED_MIME_TYPES } from '@modules/materials/domain/material.interface';
import { UploadedMulterFile } from './uploaded-file.type';

export function createMaterialsMulterOptions(config: ConfigService): MulterModuleOptions {
    const uploadDir = config.get<string>('uploads.materialsDir')!;
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }

    return {
        storage: diskStorage({
            destination: uploadDir,
            filename: (_req, file: UploadedMulterFile, callback) => {
                callback(null, `${randomUUID()}${extname(file.originalname)}`);
            },
        }),
        limits: {
            fileSize: config.get<number>('uploads.maxFileSizeBytes'),
        },
        fileFilter: (_req, file: UploadedMulterFile, callback) => {
            if (!MATERIAL_ALLOWED_MIME_TYPES[file.mimetype]) {
                callback(new BadRequestException('Only PDF and DOCX files are allowed'), false);
                return;
            }
            callback(null, true);
        },
    };
}
