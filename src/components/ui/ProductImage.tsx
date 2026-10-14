import { useEffect, useMemo, useState } from 'react'
import { Pill } from 'lucide-react'
import { productImageUrl } from '../../utils/assets'

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
  containerClassName?: string
  showInitials?: boolean
}

function brandInitials(alt: string) {
  const word = alt.split(/\s+/)[0] ?? alt
  return word.slice(0, 3).toUpperCase()
}

export default function ProductImage({
  src,
  alt,
  className = 'max-h-full max-w-full object-contain',
  containerClassName = '',
  showInitials = true,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const [fallbackSrc, setFallbackSrc] = useState<string | undefined>()

  useEffect(() => {
    setFailed(false)
    setFallbackSrc(undefined)
  }, [src])

  const imageSrc = useMemo(() => {
    if (fallbackSrc) return fallbackSrc
    return productImageUrl(src)
  }, [src, fallbackSrc])

  const placeholder = (
    <div className={`flex items-center justify-center ${containerClassName}`}>
      <div className="w-20 h-20 rounded-2xl gradient-blue flex flex-col items-center justify-center shadow-inner">
        {showInitials ? (
          <>
            <span className="text-white font-bold text-sm tracking-wide leading-none">
              {brandInitials(alt)}
            </span>
            <Pill className="w-5 h-5 text-white/70 mt-1" />
          </>
        ) : (
          <Pill className="w-10 h-10 text-white" />
        )}
      </div>
    </div>
  )

  if (!imageSrc || failed) {
    return placeholder
  }

  const handleError = () => {
    if (!fallbackSrc && src?.endsWith('.png')) {
      setFallbackSrc(productImageUrl(src.replace(/\.png$/, '.jpeg')))
      return
    }
    if (!fallbackSrc && src?.endsWith('.jpeg')) {
      setFallbackSrc(productImageUrl(src.replace(/\.jpeg$/, '.jpg')))
      return
    }
    setFailed(true)
  }

  return (
    <div className={`flex items-center justify-center ${containerClassName}`}>
      <img
        key={imageSrc}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={handleError}
        className={className}
      />
    </div>
  )
}
