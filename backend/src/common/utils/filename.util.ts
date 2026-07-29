const CYRILLIC_TO_LATIN: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ғ: 'gh',
    қ: 'q',
    ҳ: 'h',
    ҷ: 'j',
    ӣ: 'i',
    ӯ: 'u',
};

function capitalize(value: string): string {
    return value.length ? value[0].toUpperCase() + value.slice(1) : value;
}

/**
 * Recovers UTF-8 text from a filename mangled by busboy/multer's latin1
 * decoding of multipart header bytes (e.g. "Ð¿Ñ€Ð¸Ð²ÐµÑ‚" -> "привет").
 * Safe no-op on filenames that were never mangled.
 */
export function fixMojibake(name: string): string {
    const recovered = Buffer.from(name, 'latin1').toString('utf8');
    return recovered.includes('�') ? name : recovered;
}

/** Transliterates Cyrillic characters (Russian + Tajik-specific) to Latin letters. */
export function transliterateToLatin(name: string): string {
    return Array.from(name)
        .map((char) => {
            const lower = char.toLowerCase();
            const mapped = CYRILLIC_TO_LATIN[lower];
            if (mapped === undefined) {
                return char;
            }
            return char === lower ? mapped : capitalize(mapped);
        })
        .join('');
}

/** Fixes mojibake and transliterates the result to Latin letters, in one step. */
export function sanitizeOriginalName(name: string): string {
    return transliterateToLatin(fixMojibake(name));
}
