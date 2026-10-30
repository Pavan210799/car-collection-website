import { useCallback, useState } from 'react'

const SIZES = [
  ['sm', 800],
  ['md', 1600],
  ['lg', 3840],
]

export const srcSetFor = (src) => SIZES.map(([suffix, width]) => `${src}-${suffix}.webp ${width}w`).join(', ')

export const srcFor = (src, size = 'md') => `${src}-${size}.webp`

const POSITIONED = /(^|\s)(absolute|fixed)(\s|$)/

/**
 * Responsive local image. `src` is a base path such as `/images/cars/porsche-911-gt3-rs/01`
 * which resolves to `-sm`, `-md` and `-lg` (4K) WebP renditions.
 */
export function Img({
  src,
  alt,
  sizes = '100vw',
  priority = false,
  position = 'center',
  className = '',
  imgClassName = '',
  fit = 'cover',
  onLoad,
  ...rest
}) {
  const [loadedSrc, setLoadedSrc] = useState(null)
  const loaded = loadedSrc === src
  const markIfCached = useCallback(
    (node) => {
      if (node?.complete && node.naturalWidth > 0) setLoadedSrc(src)
    },
    [src],
  )

  return (
    <div className={`${POSITIONED.test(className) ? '' : 'relative'} overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className={`skeleton absolute inset-0 transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`}
      />
      <img
        ref={markIfCached}
        src={srcFor(src, 'md')}
        srcSet={srcSetFor(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable="false"
        onLoad={(event) => {
          setLoadedSrc(src)
          onLoad?.(event)
        }}
        style={{ objectPosition: position }}
        className={`relative size-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} transition-[opacity,filter] duration-700 ease-premium ${
          loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
        } ${imgClassName}`}
        {...rest}
      />
    </div>
  )
}
