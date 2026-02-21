/**
 * Utilidad para generar slugs URL-friendly
 * Normaliza texto eliminando acentos y caracteres especiales
 */

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-')     // Reemplazar caracteres no alfanuméricos
    .replace(/(^-|-$)/g, '');        // Eliminar guiones al inicio/final
}

/**
 * Genera un slug único añadiendo timestamp si ya existe
 */
export function generateUniqueSlug(
  baseSlug: string,
  existsCheck: (slug: string) => Promise<boolean>
): Promise<string> {
  return existsCheck(baseSlug).then((exists) => {
    if (!exists) return baseSlug;
    return `${baseSlug}-${Date.now()}`;
  });
}

/**
 * Versión síncrona para casos donde no se puede usar async
 */
export function generateUniqueSlugSync(
  baseSlug: string,
  exists: boolean
): string {
  if (!exists) return baseSlug;
  return `${baseSlug}-${Date.now()}`;
}
