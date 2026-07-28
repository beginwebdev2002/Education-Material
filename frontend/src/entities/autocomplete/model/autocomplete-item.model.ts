import { Translations } from './autocomplete-list.model';

export type InstitutionType = 'UNIVERSITY' | 'SCHOOL';
export type SubjectKind = 'SCHOOL_SUBJECT' | 'SPECIALIZATION';

export interface AutocompleteItem {
    _id: string;
    list: string;
    translations: Translations;
    parentItems: AutocompleteItem[] | string[];
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export interface CreateAutocompleteItemPayload {
    list: string;
    translations: Translations;
    parentItems?: string[];
    metadata?: Record<string, unknown>;
}

export interface UpdateAutocompleteItemPayload {
    translations?: Translations;
    parentItems?: string[];
    metadata?: Record<string, unknown>;
}
