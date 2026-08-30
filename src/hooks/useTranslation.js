import { useCallback } from 'react'
import { useSettings } from '../context/AuthContext'
import { getTranslation } from '../i18n'

export function useTranslation() {
  const { settings } = useSettings()

  const language = settings?.language || 'en'

  const t = useCallback(
    (key) => getTranslation(language, key),
    [language]
  )

  return {
    t,
    language,
  }
}