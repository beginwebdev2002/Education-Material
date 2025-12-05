export function bindUrl(path: string | string[], base = 'http://localhost:3000'): string {
    const normalize = (s: string) => String(s ?? '').trim().replace(/^\/+|\/+$/g, '');
    const append = (b: string, seg: string) => `${b.replace(/\/+$/, '')}/${normalize(seg)}`;

    if (Array.isArray(path)) {
        if (path.length === 0) return base;
        const [first, ...rest] = path;
        const newBase = append(base, first);
        return bindUrl(rest, newBase);
    }

    if (!path) return base;
    return append(base, path);
}