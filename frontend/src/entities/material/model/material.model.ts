export type MaterialStatus = 'PENDING' | 'PUBLISHED' | 'REJECTED';
export type MaterialFormat = 'PDF' | 'DOCX';

export interface MaterialOwner {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}

export interface Material {
    _id: string;
    title: string;
    description: string;
    subject: string;
    level: string;
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
    subject: string;
    level: string;
    file: File;
}
