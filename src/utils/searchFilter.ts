/**
 * Escapes regex special characters safely
 */
export function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Checks if a target string contains a search term (case-insensitive)
 */
export function matchesQuery(target: string | undefined | null, query: string): boolean {
  if (!target || !query) return false;
  return target.toLowerCase().includes(query.toLowerCase().trim());
}

/**
 * Checks if any element in a list of tags matches the search query (case-insensitive)
 */
export function matchesTags(tags: string[] | undefined | null, query: string): boolean {
  if (!tags || !Array.isArray(tags) || !query) return false;
  const cleanQuery = query.toLowerCase().trim();
  return tags.some(
    (tag) =>
      typeof tag === 'string' &&
      (tag.toLowerCase().includes(cleanQuery) || cleanQuery.includes(tag.toLowerCase()))
  );
}

/**
 * Creates a debounce handler for search input events
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}
