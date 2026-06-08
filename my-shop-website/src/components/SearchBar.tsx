import { useCartStore } from '../stores/useCartStore'
import { useThemeStore } from '../stores/useThemeStore'

export default function SearchBar() {
  const totalCount = useCartStore((s) => s.allCount)
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  function badgeText() {
    if (totalCount === 0) return null
    if (totalCount > 99) return '99+'
    return String(totalCount)
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] px-4 py-2">
      <div className="flex items-center gap-3 max-w-[1126px] mx-auto">
        {/* 主题切换按钮 */}
        <button
          onClick={toggleTheme}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-base"
          aria-label="切换亮/暗模式"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* 搜索框 */}
        <a
          href="#/search"
          className="flex-1 h-9 px-3 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-sm flex items-center select-none"
        >
          🔍 搜索商品
        </a>

        {/* 购物车图标 + 角标 */}
        <a href="#/cart" className="relative flex-shrink-0 p-1">
          <span className="text-2xl">🛒</span>
          {badgeText() && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[var(--color-brand)] text-white text-[10px] font-bold flex items-center justify-center px-0.5">
              {badgeText()}
            </span>
          )}
        </a>
      </div>
    </header>
  )
}
