import { useState, useCallback } from 'react'
import './TweaksPanel.css'

export function useTweaks(defaults) {
  const [state, setState] = useState(defaults)
  const setTweak = useCallback((key, value) => {
    setState(prev => ({ ...prev, [key]: value }))
  }, [])
  return [state, setTweak]
}

export function TweaksPanel({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="tweaks-panel">
      <div className="tweaks-panel__header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span className="tweaks-panel__chev" data-open={open}>▾</span>
      </div>
      {open && <div className="tweaks-panel__body">{children}</div>}
    </div>
  )
}

export function TweakSection({ label }) {
  return <div className="tweaks-panel__section">{label}</div>
}

export function TweakRadio({ label, value, options, onChange }) {
  return (
    <div className="tweaks-panel__radio">
      <span className="tweaks-panel__radio-label">{label}</span>
      <div className="tweaks-panel__options">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            className={`tweaks-panel__option${opt === value ? ' tweaks-panel__option--selected' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
