import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AutocompleteList, AutocompleteListSchema } from '@modules/autocomplete/entities/autocomplete-list.schema';
import { AutocompleteItem, AutocompleteItemSchema } from '@modules/autocomplete/entities/autocomplete-item.schema';
import { AutocompleteController } from '@modules/autocomplete/autocomplete.controller';
import { AutocompleteService } from '@modules/autocomplete/autocomplete.service';
import { UsersModule } from '@modules/users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AutocompleteList.name, schema: AutocompleteListSchema },
            { name: AutocompleteItem.name, schema: AutocompleteItemSchema },
        ]),
        UsersModule,
    ],
    controllers: [AutocompleteController],
    providers: [AutocompleteService],
    exports: [AutocompleteService],
})
export class AutocompleteModule { }
