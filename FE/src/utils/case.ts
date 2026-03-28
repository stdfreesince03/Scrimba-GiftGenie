export function toTitleCase(str:string) : string {
    return str.toLowerCase().replace(/(^|\s)\w/g, s => s.toUpperCase());
}