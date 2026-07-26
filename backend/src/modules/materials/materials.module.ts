import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { Material, MaterialSchema } from './domain/material.schema';
import { MaterialsRepository } from './infrastructure/materials.repository';
import { MaterialsController } from './infrastructure/materials.controller';
import { MaterialsService } from './application/materials.service';
import { createMaterialsMulterOptions } from './infrastructure/materials-multer.config';
import { ActivityModule } from '@modules/activity/activity.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Material.name, schema: MaterialSchema }]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => createMaterialsMulterOptions(config),
            inject: [ConfigService],
        }),
        ActivityModule,
    ],
    controllers: [MaterialsController],
    providers: [MaterialsService, MaterialsRepository],
    exports: [MaterialsRepository],
})
export class MaterialsModule { }
