import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import en from './en.js'
import th from './th.js'

const DICTS = { en, th }

const I18nContext = createContext({ locale: 'en', dict: en, setLocale: () => {} })

export function I18nProvider({ locale: initialLocale = 'en', children }) {
  const [locale, setLocaleState] = useState(initialLocale)

  const setLocale = useCallback((newLocale) => {
    if (DICTS[newLocale]) {
      setLocaleState(newLocale)
      // Update URL without refreshing
      const newPath = newLocale === 'th' ? '/th/' : '/'
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath)
      }
      document.documentElement.lang = newLocale
      // Sticky preference: the edge worker reads this cookie before falling
      // back to Accept-Language, so a manual EN/TH switch survives reloads.
      document.cookie = `siftly_locale=${newLocale};Max-Age=31536000;Path=/;SameSite=Lax`
    }
  }, [])

  const value = useMemo(() => ({
    locale,
    dict: DICTS[locale] || en,
    setLocale
  }), [locale, setLocale])

  useEffect(() => {
    const handlePopState = () => {
      const pathLocale = window.location.pathname.startsWith('/th') ? 'th' : 'en'
      setLocale(pathLocale)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setLocale])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useT() {
  const { dict } = useContext(I18nContext)
  return (key) => (key in dict ? dict[key] : key)
}

export function useLocale() {
  const { locale, setLocale } = useContext(I18nContext)
  return [locale, setLocale]
}

export const SUPPORTED_LOCALES = ['en', 'th']
