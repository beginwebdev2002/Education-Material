export enum MaterialStatus {
    PENDING = 'PENDING',
    PUBLISHED = 'PUBLISHED',
    REJECTED = 'REJECTED',
}

export enum MaterialFormat {
    PDF = 'PDF',
    DOCX = 'DOCX',
    ZIP = 'ZIP',
}

export enum MaterialCategory {
    SYLLABUS = 'SYLLABUS',
    LECTURES = 'LECTURES',
    TEST_QUESTIONS = 'TEST_QUESTIONS',
}

export const MATERIAL_ALLOWED_MIME_TYPES: Record<string, MaterialFormat> = {
    'application/pdf': MaterialFormat.PDF,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': MaterialFormat.DOCX,
};
