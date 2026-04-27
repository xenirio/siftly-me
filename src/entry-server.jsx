import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

export function renderPrivacy(contentHtml) {
  return renderToString(
    <StrictMode>
      <PrivacyPolicy contentHtml={contentHtml} />
    </StrictMode>
  )
}
