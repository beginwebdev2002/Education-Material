import { fixMojibake, sanitizeOriginalName, transliterateToLatin } from '@common/utils/filename.util';

describe('filename.util', () => {
    describe('fixMojibake', () => {
        it('recovers UTF-8 Cyrillic text from latin1-mangled bytes', () => {
            const mangled = Buffer.from('силабус.docx', 'utf8').toString('latin1');
            expect(fixMojibake(mangled)).toBe('силабус.docx');
        });

        it('leaves already-correct ASCII filenames untouched', () => {
            expect(fixMojibake('report.pdf')).toBe('report.pdf');
        });
    });

    describe('transliterateToLatin', () => {
        it('transliterates Russian Cyrillic to Latin letters', () => {
            expect(transliterateToLatin('силабус')).toBe('silabus');
        });

        it('transliterates Tajik-specific Cyrillic letters', () => {
            expect(transliterateToLatin('ғарб')).toBe('gharb');
        });

        it('preserves the file extension and case', () => {
            expect(transliterateToLatin('Привет.docx')).toBe('Privet.docx');
        });
    });

    describe('sanitizeOriginalName', () => {
        it('fixes mojibake and transliterates in one pass', () => {
            const mangled = Buffer.from('силабус.docx', 'utf8').toString('latin1');
            expect(sanitizeOriginalName(mangled)).toBe('silabus.docx');
        });
    });
});
