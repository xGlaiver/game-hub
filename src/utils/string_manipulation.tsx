export function capitalizeFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function normalize_string(s: string): string {
    return s.trim().toLowerCase();
}
