import type { Translations } from '@shared/models';

export type MaterialStatus = 'PENDING' | 'PUBLISHED' | 'REJECTED';
export type MaterialFormat = 'PDF' | 'DOCX' | 'ZIP';
export type MaterialCategory = 'SYLLABUS' | 'LECTURES' | 'TEST_QUESTIONS';

export const MATERIAL_CATEGORIES: MaterialCategory[] = ['SYLLABUS', 'LECTURES', 'TEST_QUESTIONS'];

export interface MaterialOwner {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}

/** Populated reference to an entities/autocomplete AutocompleteItem — kept as a
 * structural local type rather than importing the entities/autocomplete slice
 * directly, since FSD forbids same-layer (entities-to-entities) cross-imports. */
export interface MaterialAutocompleteRef {
    _id: string;
    translations: Translations;
    metadata?: Record<string, unknown>;
}

export interface Material {
    _id: string;
    title: string;
    description: string;
    institution: MaterialAutocompleteRef;
    subject: MaterialAutocompleteRef;
    category: MaterialCategory[];
    format: MaterialFormat;
    originalName: string;
    mimeType: string;
    size: number;
    owner: MaterialOwner;
    status: MaterialStatus;
    downloadsCount: number;
    commentsCount: number;
    createdAt: string;
}

export interface CreateMaterialPayload {
    title: string;
    description: string;
    institution: string;
    subject: string;
    category: MaterialCategory[];
    files: File[];
}
