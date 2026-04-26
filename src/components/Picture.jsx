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
  // React 18 doesn't recognize the camelCase fetchPriority attribute; spread
  // a lowercase HTML attr instead so it passes through to the DOM cleanly.
  const extra = fetchPriority ? { fetchpriority: fetchPriority } : null
  return (
    <picture>
      {sources.avif && <source type="image/avif" srcSet={sources.avif} sizes={sizes} />}
      {sources.webp && <source type="image/webp" srcSet={sources.webp} sizes={sizes} />}
      <img
        src={img.src}
        width={img.w}
        height={img.h}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        {...extra}
      />
    </picture>
  )
}
