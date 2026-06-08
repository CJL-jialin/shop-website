import { useState, useEffect, useRef, useCallback } from 'react'
import ProductCard from './ProductCard'
import { apiGet } from '../api/client'
import { type Product } from '../mock/products'

interface BackendProduct {
  id: string
  name: string
  price: number
  image_url: string | null
}

interface Props {
  startPage?: number
}

export default function ProductWaterfall({ startPage = 1 }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(startPage - 1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(99)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadPage = useCallback(async (p: number) => {
    if (loading) return
    setLoading(true)
    try {
      const data = await apiGet<{ products: BackendProduct[]; total: number }>(
        `/products?page=${p}&size=10`,
      )
      const mapped: Product[] = data.products.map((bp) => ({
        id: bp.id,
        name: bp.name,
        price: bp.price,
        imageUrl: bp.image_url ?? '',
      }))
      setProducts((prev) => [...prev, ...mapped])
      setPage(p)
      setTotalPages(Math.ceil(data.total / 10))
      setHasMore(p < Math.ceil(data.total / 10))
    } catch {
      // 后端不可用时静默降级
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading])

  // 首屏加载
  useEffect(() => {
    loadPage(startPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // IntersectionObserver
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadPage(page + 1)
      }
    },
    [hasMore, loading, page, loadPage],
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
