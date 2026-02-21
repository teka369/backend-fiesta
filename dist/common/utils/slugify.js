"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSlug = toSlug;
exports.generateUniqueSlug = generateUniqueSlug;
exports.generateUniqueSlugSync = generateUniqueSlugSync;
function toSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
function generateUniqueSlug(baseSlug, existsCheck) {
    return existsCheck(baseSlug).then((exists) => {
        if (!exists)
            return baseSlug;
        return `${baseSlug}-${Date.now()}`;
    });
}
function generateUniqueSlugSync(baseSlug, exists) {
    if (!exists)
        return baseSlug;
    return `${baseSlug}-${Date.now()}`;
}
//# sourceMappingURL=slugify.js.map