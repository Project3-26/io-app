const THEME_PREFERENCE_KEY = 'project326-theme-preference'

export function readThemePreference() {
  try {
    return localStorage.getItem(THEME_PREFERENCE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function applyThemePreference(theme) {
  const normalizedTheme = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.dataset.theme = normalizedTheme
  document.documentElement.style.colorScheme = normalizedTheme
  return normalizedTheme
}

export function saveThemePreference(theme) {
  const normalizedTheme = applyThemePreference(theme)
  try {
    localStorage.setItem(THEME_PREFERENCE_KEY, normalizedTheme)
  } catch {
    // The visual preference can still apply for this visit if storage is unavailable.
  }
  return normalizedTheme
}
