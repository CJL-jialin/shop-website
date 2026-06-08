import { useState, useEffect, useRef, useCallback } from 'react'
import type { Banner } from '../mock/banners'

interface Props {
  banners: Banner[]
}

export default function BannerCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0)
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)
  const len = banners.length

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (len <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % len)
    }, 3000)
  }, [len])

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetTimer])

  function goTo(idx: number) {
    setCurrent(idx)
    resetTimer()
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) < 40) return
    if (diff > 0) {
      goTo((current + 1) % len)
    } else {
      goTo((current - 1 + len) % len)
    }
  }

  function onImgError(id: string) {
    setImgErrors((prev) => new Set(prev).add(id))
  }

  if (len === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-200 dark:bg-gray-700"
      style={{ aspectRatio: '2 / 1' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 图片轨道 */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((b) => (
          <a
            key={b.id}
            href={b.link}
            className="w-full h-full flex-shrink-0"
          >
            {imgErrors.has(b.id) ? (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-400 text-sm">
                图片加载失败
              </div>
            ) : (
              <img
                src={b.imageUrl}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => onImgError(b.id)}
              />
            )}
          </a>
        ))}
      </div>

      {/* 圆点指示器 — 只在 >1 张时显示 */}
      {len > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current
                  ? 'bg-[var(--color-brand)]'
                  : 'bg-white/70 dark:bg-white/50'
              }`}
              aria-label={`第 ${i + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
