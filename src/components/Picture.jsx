import { useEffect, useRef, useState } from 'react'

export default function Picture({
  image,
  alt = '',
  className,
  loading,
  decoding = 'async',
  fetchPriority,
  sizes,
}) {
  const sources = image?.sources ?? {}
  const img = image?.img ?? {}
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)

  // Catch images that finished decoding before React attached its onLoad
  // listener (cached lazy images on a return visit, or the preloaded LCP).
  useEffect(() => {
    const node = ref.current
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true)
  }, [])

  // React 18 doesn't recognize the camelCase fetchPriority attribute; spread
  // a lowercase HTML attr instead so it passes through to the DOM cleanly.
  const extra = fetchPriority ? { fetchpriority: fetchPriority } : null
  return (
    <picture>
      {sources.avif && <source type="image/avif" srcSet={sources.avif} sizes={sizes} />}
      {sources.webp && <source type="image/webp" srcSet={sources.webp} sizes={sizes} />}
      <img
        ref={ref}
        src={img.src}
        width={img.w}
        height={img.h}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        data-loaded={loaded ? '' : undefined}
        onLoad={() => setLoaded(true)}
        {...extra}
      />
    </picture>
  )
}
