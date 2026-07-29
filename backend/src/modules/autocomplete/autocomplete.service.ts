import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AutocompleteList, AutocompleteListDocument } from '@modules/autocomplete/entities/autocomplete-list.schema';
import { AutocompleteItem, AutocompleteItemDocument } from '@modules/autocomplete/entities/autocomplete-item.schema';
import { CreateAutocompleteListDto } from '@modules/autocomplete/dto/create-autocomplete-list.dto';
import { UpdateAutocompleteListDto } from '@modules/autocomplete/dto/update-autocomplete-list.dto';
import { CreateAutocompleteItemDto } from '@modules/autocomplete/dto/create-autocomplete-item.dto';
import { UpdateAutocompleteItemDto } from '@modules/autocomplete/dto/update-autocomplete-item.dto';
import { Translations } from '@modules/autocomplete/autocomplete.interface';
import { INSTITUTIONS_SEED } from '@modules/autocomplete/seed-data/institutions.seed';
import { SUBJECTS_SEED } from '@modules/autocomplete/seed-data/subjects.seed';
import { PaginatedResult } from '@common/interfaces/paginated-result.interface';

const ITEM_PARENT_POPULATE = 'translations metadata';
const INSTITUTIONS_LIST_KEY = 'educational-institutions';
const SUBJECTS_LIST_KEY = 'subjects-specializations';

@Injectable()
export class AutocompleteService {
    constructor(
        @InjectModel(AutocompleteList.name) private readonly listModel: Model<AutocompleteListDocument>,
        @InjectModel(AutocompleteItem.name) private readonly itemModel: Model<AutocompleteItemDocument>,
    ) { }

    // ---- Lists ----

    async createList(dto: CreateAutocompleteListDto): Promise<AutocompleteListDocument> {
        return this.listModel.create(dto);
    }

    async listLists(page: number, limit: number, search?: string): Promise<PaginatedResult<AutocompleteListDocument>> {
        const filter: Record<string, unknown> = search
            ? {
                $or: [
                    { key: { $regex: search, $options: 'i' } },
                    { 'labelTranslations.en': { $regex: search, $options: 'i' } },
                    { 'labelTranslations.ru': { $regex: search, $options: 'i' } },
                    { 'labelTranslations.tj': { $regex: search, $options: 'i' } },
                ],
            }
            : {};
        const [items, total] = await Promise.all([
            this.listModel
                .find(filter)
                .sort({ key: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.listModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit };
    }

    async getListById(id: string): Promise<AutocompleteListDocument> {
        const list = await this.listModel.findById(id).exec();
        if (!list) {
            throw new NotFoundException('Autocomplete list not found');
        }
        return list;
    }

    async getListByKey(key: string): Promise<AutocompleteListDocument> {
        const list = await this.listModel.findOne({ key }).exec();
        if (!list) {
            throw new NotFoundException(`Autocomplete list "${key}" not found`);
        }
        return list;
    }

    async findOrCreateList(key: string, labelTranslations: Translations, description?: string): Promise<AutocompleteListDocument> {
        const existing = await this.listModel.findOne({ key }).exec();
        if (existing) {
            return existing;
        }
        return this.listModel.create({ key, labelTranslations, description });
    }

    async updateList(id: string, dto: UpdateAutocompleteListDto): Promise<AutocompleteListDocument> {
        const updated = await this.listModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException('Autocomplete list not found');
        }
        return updated;
    }

    async removeList(id: string): Promise<void> {
        const list = await this.listModel.findById(id).exec();
        if (!list) {
            throw new NotFoundException('Autocomplete list not found');
        }

        const itemsInList = await this.itemModel.find({ list: list._id }, '_id').exec();
        const itemIds = itemsInList.map((item) => item._id);

        await this.listModel.findByIdAndDelete(id).exec();
        if (itemIds.length > 0) {
            await this.itemModel.deleteMany({ list: list._id }).exec();
            await this.itemModel.updateMany({}, { $pull: { parentItems: { $in: itemIds } } }).exec();
        }
    }

    // ---- Items ----

    async createItem(dto: CreateAutocompleteItemDto): Promise<AutocompleteItemDocument> {
        await this.getListById(dto.list);
        if (dto.parentItems && dto.parentItems.length > 0) {
            await this.assertItemsExist(dto.parentItems);
        }

        const created = await this.itemModel.create({
            list: new Types.ObjectId(dto.list),
            translations: dto.translations,
            parentItems: (dto.parentItems ?? []).map((id) => new Types.ObjectId(id)),
            metadata: dto.metadata,
        });
        return created.populate('parentItems', ITEM_PARENT_POPULATE);
    }

    async listItems(params: {
        listId?: string;
        listKey?: string;
        parentItem?: string;
        search?: string;
        page: number;
        limit: number;
    }): Promise<PaginatedResult<AutocompleteItemDocument>> {
        const { parentItem, search, page, limit } = params;

        const listId = params.listId
            ? params.listId
            : params.listKey
                ? (await this.getListByKey(params.listKey))._id.toString()
                : undefined;
        if (!listId) {
            throw new BadRequestException('Either listId or listKey is required');
        }

        const filter: Record<string, unknown> = { list: new Types.ObjectId(listId) };

        if (parentItem) {
            const parentItemObjectId = new Types.ObjectId(parentItem);
            filter.$or = [
                { parentItems: { $exists: false } },
                { parentItems: { $size: 0 } },
                { parentItems: parentItemObjectId },
            ];
        }

        if (search) {
            const searchClause = [
                { 'translations.en': { $regex: search, $options: 'i' } },
                { 'translations.ru': { $regex: search, $options: 'i' } },
                { 'translations.tj': { $regex: search, $options: 'i' } },
            ];
            filter.$and = [{ $or: searchClause }];
        }

        const [items, total] = await Promise.all([
            this.itemModel
                .find(filter)
                .sort({ 'translations.en': 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('parentItems', ITEM_PARENT_POPULATE)
                .exec(),
            this.itemModel.countDocuments(filter).exec(),
        ]);

        return { items, total, page, limit };
    }

    async getItemById(id: string): Promise<AutocompleteItemDocument> {
        const item = await this.itemModel.findById(id).populate('parentItems', ITEM_PARENT_POPULATE).exec();
        if (!item) {
            throw new NotFoundException('Autocomplete item not found');
        }
        return item;
    }

    async updateItem(id: string, dto: UpdateAutocompleteItemDto): Promise<AutocompleteItemDocument> {
        if (dto.parentItems && dto.parentItems.length > 0) {
            await this.assertItemsExist(dto.parentItems);
        }

        const update: Record<string, unknown> = {};
        if (dto.translations) update.translations = dto.translations;
        if (dto.parentItems) update.parentItems = dto.parentItems.map((itemId) => new Types.ObjectId(itemId));
        if (dto.metadata) update.metadata = dto.metadata;

        const updated = await this.itemModel
            .findByIdAndUpdate(id, update, { new: true })
            .populate('parentItems', ITEM_PARENT_POPULATE)
            .exec();
        if (!updated) {
            throw new NotFoundException('Autocomplete item not found');
        }
        return updated;
    }

    async removeItem(id: string): Promise<void> {
        const item = await this.itemModel.findById(id).exec();
        if (!item) {
            throw new NotFoundException('Autocomplete item not found');
        }
        await this.itemModel.findByIdAndDelete(id).exec();
        await this.itemModel.updateMany({}, { $pull: { parentItems: item._id } }).exec();
    }

    private async assertItemsExist(ids: string[]): Promise<void> {
        const count = await this.itemModel.countDocuments({ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } }).exec();
        if (count !== ids.length) {
            throw new BadRequestException('One or more parentItems do not exist');
        }
    }

    // ---- Materials integration ----

    async validateInstitutionSubjectPair(institutionId: string, subjectId: string): Promise<void> {
        const [institutionsList, subjectsList] = await Promise.all([
            this.getListByKey('educational-institutions'),
            this.getListByKey('subjects-specializations'),
        ]);

        const [institution, subject] = await Promise.all([
            this.itemModel.findById(institutionId).exec(),
            this.itemModel.findById(subjectId).exec(),
        ]);

        if (!institution || institution.list.toString() !== institutionsList._id.toString()) {
            throw new BadRequestException('Selected institution is invalid');
        }
        if (!subject || subject.list.toString() !== subjectsList._id.toString()) {
            throw new BadRequestException('Selected subject is invalid');
        }
        if (subject.parentItems.length > 0) {
            const isLinked = subject.parentItems.some((parentId) => parentId.toString() === institutionId);
            if (!isLinked) {
                throw new BadRequestException('This subject is not available for the selected institution');
            }
        }
    }

    // ---- Seeding ----

    async seedIfEmpty(): Promise<void> {
        const institutionsList = await this.findOrCreateList(INSTITUTIONS_LIST_KEY, {
            en: 'Educational Institutions',
            ru: 'Образовательные учреждения',
            tj: 'Муассисаҳои таълимӣ',
        });
        const subjectsList = await this.findOrCreateList(SUBJECTS_LIST_KEY, {
            en: 'Subjects & Specializations',
            ru: 'Предметы и специальности',
            tj: 'Фанҳо ва ихтисосҳо',
        });

        const keyToObjectId = new Map<string, Types.ObjectId>();

        const institutionsCount = await this.itemModel.countDocuments({ list: institutionsList._id }).exec();
        if (institutionsCount === 0 && INSTITUTIONS_SEED.length > 0) {
            const inserted = await this.itemModel.insertMany(
                INSTITUTIONS_SEED.map((item) => ({
                    list: institutionsList._id,
                    translations: item.translations,
                    parentItems: [],
                    metadata: item.metadata,
                })),
            );
            inserted.forEach((doc, index) => keyToObjectId.set(INSTITUTIONS_SEED[index].key, doc._id));
        }

        const subjectsCount = await this.itemModel.countDocuments({ list: subjectsList._id }).exec();
        if (subjectsCount === 0 && SUBJECTS_SEED.length > 0) {
            await this.itemModel.insertMany(
                SUBJECTS_SEED.map((item) => ({
                    list: subjectsList._id,
                    translations: item.translations,
                    parentItems: (item.parentInstitutionKeys ?? [])
                        .map((key) => keyToObjectId.get(key))
                        .filter((id): id is Types.ObjectId => id !== undefined),
                    metadata: item.metadata,
                })),
            );
        }
    }
}
