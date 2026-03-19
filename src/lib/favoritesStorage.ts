const FAVORITES_STORAGE_KEY = 'ads-works-favorites'

const sanitizeFavoriteIds = (
  rawValue: unknown,
  validWorkIds: string[] = [],
): string[] => {
  if (!Array.isArray(rawValue)) return []

  const validIdSet = new Set(validWorkIds)

  return [...new Set(
    (rawValue as unknown[]).filter(
      (value): value is string =>
        typeof value === 'string' && (!validIdSet.size || validIdSet.has(value)),
    ),
  )]
}

export const loadFavoriteIds = (validWorkIds: string[] = []): string[] => {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    return sanitizeFavoriteIds(JSON.parse(raw), validWorkIds)
  } catch {
    return []
  }
}

export const saveFavoriteIds = (favoriteIds: string[]): void => {
  try {
    const nextFavoriteIds = sanitizeFavoriteIds(favoriteIds)
    if (!nextFavoriteIds.length) {
      window.localStorage.removeItem(FAVORITES_STORAGE_KEY)
      return
    }
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavoriteIds))
  } catch {
    // Ignore storage write failures so the UI state remains functional.
  }
}
