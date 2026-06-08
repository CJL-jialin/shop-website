import { useState, useEffect, useRef, useCallback } from 'react'
import ProductCard from './ProductCard'
import { generateProducts, TOTAL_PAGES } from '../mock/products'
import type { Product } from '../mock/products'

interface Props {
  startPage?: number
}

export default function ProductWaterfall({ startPage = 1 }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(startPage - 1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // 首屏加载
  useEffect(() => {
    loadPage(startPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function loadPage(p: number) {
    if (loading) return
    setLoading(true)
    // 模拟异步加载
    setTimeout(() => {
      const newItems = generateProducts(p, 10)
      setProducts((prev) => [...prev, ...newItems])
      setPage(p)
      setHasMore(p < TOTAL_PAGES)
      setLoading(false)
    }, 400)
  }

  // IntersectionObserver：监听底部哨兵
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadPage(page + 1)
      }
    },
    [hasMore, loading, page]
  )

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '200px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersect])

  // 奇偶交替分配到左右两列
  const leftColumn: Product[] = []
  const rightColumn: Product[] = []
  // 奇偶交替：奇数索引 → 左列，偶数索引 → 右列
  products.forEach((p, i) => {
    if (i % 2 === 0) {
      leftColumn.push(p)
    } else {
      rightColumn.push(p)
    }
  })

  return (
    <section className="px-3 pb-24">
      {/* 空状态 */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-secondary)]">
          <span className="text-5xl mb-3">📭</span>
          <p className="text-sm">暂无商品</p>
        </div>
      )}

      {/* 双列瀑布流 */}
      {products.length > 0 && (
        <div className="flex gap-2.5 max-w-[1126px] mx-auto">
          <div className="flex-1 flex flex-col gap-2.5">
            {leftColumn.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-2.5">
            {rightColumn.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 底部哨兵 + 状态提示 */}
      <div ref={sentinelRef} className="flex justify-center py-5 text-xs text-[var(--color-text-secondary)]">
        {loading && <span>🔄 加载中...</span>}
        {!loading && !hasMore && products.length > 0 && <span>— 没有更多了 —</span>}
      </div>
    </section>
  )
}
