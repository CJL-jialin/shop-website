import { useState } from 'react'
import type { Product } from '../mock/products'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <a
      href={`#/product/${product.id}`}
      className="block rounded-lg overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:shadow-md transition-shadow"
    >
      {/* 商品图片 */}
      <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            图片加载失败
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* 商品信息 */}
      <div className="p-2">
        <h3 className="text-xs text-[var(--color-text-primary)] leading-tight line-clamp-2 mb-1.5">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-[var(--color-brand)]">
          ¥{product.price}
        </p>
      </div>
    </a>
  )
}
