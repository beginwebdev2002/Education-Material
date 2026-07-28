import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { Material, MaterialSchema } from '@modules/materials/entities/material.schema';
import { MaterialsController } from '@modules/materials/materials.controller';
import { MaterialsService } from '@modules/materials/materials.service';
import { createMaterialsMulterOptions } from '@modules/materials/materials-multer.config';
import { ActivityModule } from '@modules/activity/activity.module';
import { UsersModule } from '@modules/users/users.module';
import { AutocompleteModule } from '@modules/autocomplete/autocomplete.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Material.name, schema: MaterialSchema }]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => createMaterialsMulterOptions(config),
            inject: [ConfigService],
        }),
        ActivityModule,
        UsersModule,
        AutocompleteModule,
    ],
    controllers: [MaterialsController],
    providers: [MaterialsService],
    exports: [MaterialsService],
})
export class MaterialsModule { }
