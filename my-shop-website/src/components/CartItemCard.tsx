import { useState, useRef, useCallback } from 'react'
import type { CartItem as CartItemType } from '../stores/useCartStore'
import { useCartStore } from '../stores/useCartStore'
import ConfirmDialog from './ConfirmDialog'

interface Props {
  item: CartItemType
}

export default function CartItemCard({ item }: Props) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const toggleSelect = useCartStore((s) => s.toggleSelect)
  const removeItem = useCartStore((s) => s.removeItem)

  const [swipeX, setSwipeX] = useState(0)
  const [showDelete, setShowDelete] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isSwiping = useRef(false)

  const DELETE_WIDTH = 72

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current

    // 水平滑动超过垂直滑动才触发
    if (!isSwiping.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwiping.current = true
    }
    if (!isSwiping.current) return

    // 阻止页面滚动
    if (Math.abs(dx) > 10) {
      e.preventDefault()
    }

    // 只允许左滑 (dx < 0)，最大到 DELETE_WIDTH
    const clamped = Math.max(-DELETE_WIDTH, Math.min(0, dx))
    setSwipeX(clamped)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (swipeX < -DELETE_WIDTH / 2) {
      setSwipeX(-DELETE_WIDTH)
      setShowDelete(true)
    } else {
      setSwipeX(0)
      setShowDelete(false)
    }
  }, [swipeX])

  function closeSwipe() {
    setSwipeX(0)
    setShowDelete(false)
  }

  function handleDelete() {
    setShowConfirm(true)
  }

  function confirmDelete() {
    removeItem(item.itemId)
    setShowConfirm(false)
    closeSwipe()
  }

  const atMax = item.quantity >= item.stock
  const atMin = item.quantity <= 1

  return (
    <>
      {/* 左滑容器 */}
      <div className="relative overflow-hidden rounded-xl bg-[var(--color-bg-card)] shadow-sm">
        {/* 背后删除按钮 */}
        <button
          onClick={handleDelete}
          className="absolute right-0 top-0 bottom-0 bg-red-500 text-white text-sm font-bold flex items-center justify-center transition-opacity"
          style={{ width: DELETE_WIDTH, opacity: showDelete ? 1 : 0 }}
        >
          删除
        </button>

        {/* 卡片主体 — 可滑动 */}
        <div
          className="relative flex items-center gap-3 p-3 bg-[var(--color-bg-card)] transition-transform duration-150"
          style={{ transform: `translateX(${swipeX}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onClick={() => {
            if (showDelete) closeSwipe()
          }}
        >
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleSelect(item.itemId)
            }}
            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              item.selected
                ? 'bg-[var(--color-brand)] border-[var(--color-brand)]'
                : 'border-gray-300 dark:border-gray-500'
            }`}
          >
            {item.selected && (
              <span className="text-white text-xs font-bold">✓</span>
            )}
          </button>

          {/* 缩略图 */}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="flex-shrink-0 w-[60px] h-[60px] rounded-lg object-cover bg-gray-100 dark:bg-gray-700"
            loading="lazy"
          />

          {/* 名称 + 规格 */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm text-[var(--color-text-primary)] leading-tight line-clamp-2">
              {item.name}
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              {item.spec}
            </p>
            {/* 价格 + 步进器放这里 */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold text-[var(--color-brand)]">
                ¥{item.price}
              </span>

              {/* 数量步进器 */}
              <div className="flex items-center border border-[var(--color-border)] rounded-full overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!atMin) updateQuantity(item.itemId, item.quantity - 1)
                  }}
                  disabled={atMin}
                  className={`w-7 h-6 flex items-center justify-center text-xs ${
                    atMin
                      ? 'text-gray-300 dark:text-gray-600'
                      : 'text-[var(--color-text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  −
                </button>
                <span className="w-7 h-6 flex items-center justify-center text-xs text-[var(--color-text-primary)] border-x border-[var(--color-border)]">
                  {item.quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!atMax) updateQuantity(item.itemId, item.quantity + 1)
                  }}
                  disabled={atMax}
                  className={`w-7 h-6 flex items-center justify-center text-xs ${
                    atMax
                      ? 'text-gray-300 dark:text-gray-600'
                      : 'text-[var(--color-text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      {showConfirm && (
        <ConfirmDialog
          title="确认删除"
          message={`确定要删除「${item.name}」吗？`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}
