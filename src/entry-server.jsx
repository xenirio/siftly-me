import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import { I18nProvider } from './i18n/index.jsx'

export function render(locale = 'en') {
  return renderToString(
    <StrictMode>
      <I18nProvider locale={locale}>
        <App />
      </I18nProvider>
    </StrictMode>
  )
}

export function renderPrivacy(contentHtml, locale = 'en') {
  return renderToString(
    <StrictMode>
      <I18nProvider locale={locale}>
        <PrivacyPolicy contentHtml={contentHtml} />
      </I18nProvider>
    </StrictMode>
  )
}
