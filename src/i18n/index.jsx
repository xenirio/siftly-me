import { createContext, useContext } from 'react'
import en from './en.js'
import th from './th.js'

const DICTS = { en, th }

const I18nContext = createContext({ locale: 'en', dict: en })

export function I18nProvider({ locale = 'en', children }) {
  const dict = DICTS[locale] || en
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useT() {
  const { dict } = useContext(I18nContext)
  return (key) => (key in dict ? dict[key] : key)
}

export function useLocale() {
  return useContext(I18nContext).locale
}

export const SUPPORTED_LOCALES = ['en', 'th']
