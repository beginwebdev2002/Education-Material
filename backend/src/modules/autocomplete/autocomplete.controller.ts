import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AutocompleteService } from '@modules/autocomplete/autocomplete.service';
import { CreateAutocompleteListDto } from '@modules/autocomplete/dto/create-autocomplete-list.dto';
import { UpdateAutocompleteListDto } from '@modules/autocomplete/dto/update-autocomplete-list.dto';
import { CreateAutocompleteItemDto } from '@modules/autocomplete/dto/create-autocomplete-item.dto';
import { UpdateAutocompleteItemDto } from '@modules/autocomplete/dto/update-autocomplete-item.dto';
import { ListItemsQueryDto } from '@modules/autocomplete/dto/list-items-query.dto';
import { PublicListItemsQueryDto } from '@modules/autocomplete/dto/public-list-items-query.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@modules/users/user-role.enum';

@Controller('autocomplete')
export class AutocompleteController {
    constructor(private readonly autocompleteService: AutocompleteService) { }

    @Get('lists')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async listLists(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 50,
        @Query('search') search?: string,
    ) {
        return this.autocompleteService.listLists(page, limit, search);
    }

    @Get('lists/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async getList(@Param('id') id: string) {
        return this.autocompleteService.getListById(id);
    }

    @Post('lists')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async createList(@Body() dto: CreateAutocompleteListDto) {
        return this.autocompleteService.createList(dto);
    }

    @Patch('lists/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateList(@Param('id') id: string, @Body() dto: UpdateAutocompleteListDto) {
        return this.autocompleteService.updateList(id, dto);
    }

    @Delete('lists/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async removeList(@Param('id') id: string) {
        await this.autocompleteService.removeList(id);
        return { success: true };
    }

    @Get('items')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async listItems(@Query() query: ListItemsQueryDto) {
        return this.autocompleteService.listItems({
            listId: query.listId,
            parentItem: query.parentItem,
            search: query.search,
            page: query.page ?? 1,
            limit: query.limit ?? 50,
        });
    }

    @Get('items/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async getItem(@Param('id') id: string) {
        return this.autocompleteService.getItemById(id);
    }

    @Post('items')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async createItem(@Body() dto: CreateAutocompleteItemDto) {
        return this.autocompleteService.createItem(dto);
    }

    @Patch('items/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateItem(@Param('id') id: string, @Body() dto: UpdateAutocompleteItemDto) {
        return this.autocompleteService.updateItem(id, dto);
    }

    @Delete('items/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async removeItem(@Param('id') id: string) {
        await this.autocompleteService.removeItem(id);
        return { success: true };
    }

    @Get('public/items')
    async publicItems(@Query() query: PublicListItemsQueryDto) {
        return this.autocompleteService.listItems({
            listKey: query.listKey,
            parentItem: query.parentItem,
            search: query.search,
            page: query.page ?? 1,
            limit: query.limit ?? 200,
        });
    }
}
