import { HttpResponse } from '@angular/common/http';

const FILENAME_PATTERN = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i;

export function extractFilename(response: HttpResponse<Blob>, fallback: string): string {
    const disposition = response.headers.get('content-disposition');
    const match = disposition?.match(FILENAME_PATTERN);
    return match ? decodeURIComponent(match[1]) : fallback;
}

export function saveBlobResponse(response: HttpResponse<Blob>, fallbackFilename: string): void {
    const blob = response.body;
    if (!blob) {
        return;
    }

    const filename = extractFilename(response, fallbackFilename);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
