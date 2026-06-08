import { useRef } from 'react'
import { useCartStore } from '../stores/useCartStore'
import CartItemCard from '../components/CartItemCard'
import CartSettlementBar from '../components/CartSettlementBar'
import CartEmpty from '../components/CartEmpty'
import Toast from '../components/Toast'
import TabBar from '../components/TabBar'
import ProductWaterfall from '../components/ProductWaterfall'

// 猜你喜欢随机起始页（2~5），避免与首页首屏重复
function useRandomStartPage() {
  const ref = useRef(0)
  if (ref.current === 0) {
    ref.current = 2 + Math.floor(Math.random() * 4) // 2, 3, 4, or 5
  }
  return ref.current
}

export default function CartPage() {
  const recommendPage = useRandomStartPage()
  const items = useCartStore((s) => s.items)
  const allCount = useCartStore((s) => s.allCount)
  const checkoutMessage = useCartStore((s) => s.checkoutMessage)
  const clearCheckoutMessage = useCartStore((s) => s.clearCheckoutMessage)

  const isEmpty = items.length === 0

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] pb-24">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="max-w-[1126px] mx-auto">
          <h1 className="text-base font-bold text-center">
            购物车({allCount}件)
          </h1>
        </div>
      </header>

      {/* 空状态 */}
      {isEmpty && <CartEmpty />}

      {/* 商品列表 */}
      {!isEmpty && (
        <div className="px-3 pt-3 pb-4">
          <div className="flex flex-col gap-3 max-w-[1126px] mx-auto">
            {items.map((item) => (
              <CartItemCard key={item.itemId} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 猜你喜欢 — 复用瀑布流 */}
      {!isEmpty && (
        <div className="px-3 pb-4">
          <div className="max-w-[1126px] mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3 px-1">
              猜你喜欢
            </h3>
          </div>
          <ProductWaterfall startPage={recommendPage} />
        </div>
      )}

      {/* 底部结算栏 — 只在有商品时显示 */}
      {!isEmpty && <CartSettlementBar />}

      {/* Toast */}
      {checkoutMessage && (
        <Toast message={checkoutMessage} onClose={clearCheckoutMessage} />
      )}

      {/* 底部 TabBar */}
      <TabBar />
    </div>
  )
}
