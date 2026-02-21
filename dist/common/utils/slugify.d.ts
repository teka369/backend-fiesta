export declare function toSlug(text: string): string;
export declare function generateUniqueSlug(baseSlug: string, existsCheck: (slug: string) => Promise<boolean>): Promise<string>;
export declare function generateUniqueSlugSync(baseSlug: string, exists: boolean): string;
