import { useCartStore } from '../stores/useCartStore'

export default function CartSettlementBar() {
  const isAllSelected = useCartStore((s) => s.isAllSelected)
  const selectedCount = useCartStore((s) => s.selectedCount)
  const selectedTotal = useCartStore((s) => s.selectedTotal)
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll)
  const checkout = useCartStore((s) => s.checkout)

  const canCheckout = selectedCount > 0

  return (
    <div
      className="sticky bottom-0 z-50 bg-[var(--color-bg-card)] border-t border-[var(--color-border)] flex items-center px-4"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* 全选 */}
      <button
        onClick={toggleSelectAll}
        className="flex items-center gap-2 flex-shrink-0 mr-3"
      >
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            isAllSelected
              ? 'bg-[var(--color-brand)] border-[var(--color-brand)]'
              : 'border-gray-300 dark:border-gray-500'
          }`}
        >
          {isAllSelected && (
            <span className="text-white text-xs font-bold">✓</span>
          )}
        </span>
        <span className="text-xs text-[var(--color-text-secondary)]">全选</span>
      </button>

      {/* 合计金额 */}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-[var(--color-text-secondary)]">合计 </span>
        <span className="text-base font-bold text-[var(--color-brand)]">
          ¥{selectedTotal.toFixed(2)}
        </span>
      </div>

      {/* 去结算 */}
      <button
        onClick={() => {
          if (canCheckout) checkout()
        }}
        disabled={!canCheckout}
        className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
          canCheckout
            ? 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        去结算({selectedCount}件)
      </button>
    </div>
  )
}
