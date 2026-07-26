export enum MaterialStatus {
    PENDING = 'PENDING',
    PUBLISHED = 'PUBLISHED',
    REJECTED = 'REJECTED',
}

export enum MaterialFormat {
    PDF = 'PDF',
    DOCX = 'DOCX',
}

export const MATERIAL_ALLOWED_MIME_TYPES: Record<string, MaterialFormat> = {
    'application/pdf': MaterialFormat.PDF,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': MaterialFormat.DOCX,
};
