import type { Translations } from '@shared/models';

export type { Translations };

export interface AutocompleteList {
    _id: string;
    key: string;
    labelTranslations: Translations;
    description?: string;
    createdAt: string;
}

export interface CreateAutocompleteListPayload {
    key: string;
    labelTranslations: Translations;
    description?: string;
}

export interface UpdateAutocompleteListPayload {
    labelTranslations?: Translations;
    description?: string;
}
